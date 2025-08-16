package dev.streaming.upload.services;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashSet;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import dev.streaming.upload.DTO.request.EpisodeUploadRequest;
import dev.streaming.upload.DTO.request.MovieUploadRequest;
import dev.streaming.upload.DTO.response.MovieResponse;
import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.enums.MovieType;
import dev.streaming.upload.exception.AppException;
import dev.streaming.upload.exception.ErrorCode;
import dev.streaming.upload.mapper.MovieMapper;
import dev.streaming.upload.repository.CategoryRepository;
import dev.streaming.upload.repository.CountryRepository;
import dev.streaming.upload.repository.GenreRepository;
import dev.streaming.upload.repository.MovieRepository;
import dev.streaming.upload.repository.PersonRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GoogleDriveService {
    CloudinaryService cloudinaryService;
    MovieRepository movieRepository;
    GoogleDriveManager googleDriveManager;
    CategoryRepository categoryRepository;
    GenreRepository genreRepository;
    CountryRepository countryRepository;
    PersonRepository personRepository;
    MovieMapper movieMapper;
    EpisodeMapper episodeMapper;

    public MovieResponse uploadMovie(
            MovieUploadRequest request, MultipartFile thumbnailFile, MultipartFile movieFile, MultipartFile movieBackDrop)
            throws IOException {
        String movieName = request.getTitle();
        MovieType movieType = request.getType();
        if (request.getType() == MovieType.SINGLE && !movieFile.getContentType().startsWith("video/")) {
            throw new IllegalArgumentException("Movie file must be a video for single movies");
        }

        if (thumbnailFile.getContentType() == null || !thumbnailFile.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Avatar file must be an image");
        }

        String thumbnail = cloudinaryService.uploadImage(thumbnailFile,255,375);

        String backDrop = cloudinaryService.uploadImage(movieBackDrop,1920,1080);

        var categories = categoryRepository.findByNameIn(request.getCategories());
        var genres = genreRepository.findByNameIn(request.getGenres());
        var countries = countryRepository.findByNameIn(request.getCountries());
        var actors = personRepository.findByNameIn(request.getActors());
        var directors = personRepository.findByNameIn(request.getDirectors());

        // Tạo đối tượng Movie từ request trước khi tải lên Google Drive
        Movie movie = movieMapper.toMovie(request);
        movie.setGenres(new HashSet<>(genres));
        movie.setCountries(new HashSet<>(countries));
        movie.setActors(new HashSet<>(actors));
        movie.setDirectors(new HashSet<>(directors));
        movie.setCreatedAt(LocalDateTime.now());
        movie.setCategories(new HashSet<>(categories));
        
        if (movieType == MovieType.SINGLE) {
             // Tải lên Google Drive và cập nhật các thuộc tính cần thiết
            googleDriveManager.uploadMovie(movieFile, movieName, movie);
            movie.setThumbnail(thumbnail);
            movie.setBackdrop(backDrop);
            movie.setMovieType(movieType);
        } else if (movieType == MovieType.SERIES) {
            // Tải lên Google Drive và cập nhật các thuộc tính cần thiết
            movie.setMovieType(movieType);
        } else {
            throw new IllegalArgumentException("Invalid movie type");
        }

        movieRepository.save(movie);
        MovieResponse movieResponse = movieMapper.toMovieResponse(movie);
        return movieResponse;
    }


    public MovieResponse uploadEpisodeMovie ( EpisodeUploadRequest request, MultipartFile movieFile, String movieId) throws IOException {
        String movieName = request.getTitle();

        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        Episode episode = episodeMapper.toEpisode(request);
        googleDriveManager.uploadEpisodeMovie(movieFile, movieName, movie);
        
        
        
        movieRepository.save(movie);
        
        MovieResponse movieResponse = movieMapper.toMovieResponse(movie);
        
        return movieResponse;

    }
}
