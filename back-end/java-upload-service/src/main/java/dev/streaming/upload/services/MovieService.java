package dev.streaming.upload.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import dev.streaming.upload.Entity.*;
import dev.streaming.upload.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import dev.streaming.upload.DTO.request.MovieUploadRequest;
import dev.streaming.upload.DTO.response.MovieResponse;
import dev.streaming.upload.exception.AppException;
import dev.streaming.upload.exception.ErrorCode;
import dev.streaming.upload.mapper.MovieMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieService {

    GoogleDriveManager googleDriveManager;
    CategoryRepository categoryRepository;
    GenreRepository genreRepository;
    CountryRepository countryRepository;
    PersonRepository personRepository;
    MovieRepository movieRepository;
    MovieMapper movieMapper;
    CloudinaryService cloudinaryService;
    PlaylistRepository playlistRepository;

    public Page<Movie> getAllMovies(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return movieRepository.findAll(pageable);
    }

    public Movie getMovieById(String movieId) {
        return movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
    }

    public Movie getVideoId(String movieId) {
        return movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
    }

    public List<MovieResponse> getMovieRelated(String movieId) {
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        List<Long> genreIds = movie.getGenres().stream().map(Genre::getId).collect(Collectors.toList());
        List<Movie> relatedMovies = movieRepository.findRelatedMovies(genreIds, movieId);
        return relatedMovies.stream()
                .map(movieMapper::toMovieResponse)
                .collect(Collectors.toList());
    }

    public Page<MovieResponse> getMovieByCategories(String slug, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Movie> moviePage = movieRepository.findByCategorySlug(slug, pageable);
        return moviePage.map(movieMapper::toMovieResponse);
    }

    public List<MovieResponse> getNewlyUpdatedByCategory(String categorySlug) {
        List<Movie> movies = movieRepository.findByCategoriesSlugOrderByUpdatedAtDesc(categorySlug);
        return movies.stream().map(movieMapper::toMovieResponse).collect(Collectors.toList());
    }

    /**
     * [ĐÃ TỐI ƯU HÓA] Lọc phim hiệu quả bằng cách đẩy logic xuống DB.
     */
    public Page<MovieResponse> filterMovies(String categorySlug, Integer releaseYear, Long countryId, String duration, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        // 1. Gọi phương thức repository đã tối ưu hóa để lọc trên DB
        Page<Movie> moviePage = movieRepository.filterMovies(categorySlug, releaseYear, countryId, pageable);
        List<Movie> movies = new ArrayList<>(moviePage.getContent());

        // 2. Lọc bổ sung theo thời lượng (duration) trong bộ nhớ (trên một tập dữ liệu nhỏ)
        if (duration != null && !duration.isBlank()) {
            switch (duration.toLowerCase()) {
                case "short":
                    movies.removeIf(movie -> movie.getDuration() >= 90);
                    break;
                case "medium":
                    movies.removeIf(movie -> movie.getDuration() < 90 || movie.getDuration() > 120);
                    break;
                case "long":
                    movies.removeIf(movie -> movie.getDuration() <= 120);
                    break;
                default:
                    log.warn("Invalid duration filter: {}", duration);
            }
        }

        List<MovieResponse> movieResponses = movies.stream().map(movieMapper::toMovieResponse).collect(Collectors.toList());

        // 3. Trả về một trang mới với dữ liệu đã lọc cuối cùng
        return new PageImpl<>(movieResponses, pageable, moviePage.getTotalElements());
    }

    public Movie updateMovie(
            MovieUploadRequest request,
            String movieId,
            MultipartFile thumbnailFile,
            MultipartFile movieFile,
            MultipartFile movieBackDrop
    ) throws Exception {
        var categories = categoryRepository.findByNameIn(request.getCategories());
        var genres = genreRepository.findByNameIn(request.getGenres());
        var countries = countryRepository.findByNameIn(request.getCountries());
        var actors = personRepository.findByNameIn(request.getActors());
        var directors = personRepository.findByNameIn(request.getDirectors());
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
            String thumbnail = cloudinaryService.uploadImage(thumbnailFile, 255, 375);
            movie.setThumbnail(thumbnail);
        }

        if (movieBackDrop != null && !movieBackDrop.isEmpty()) {
            String backdrop = cloudinaryService.uploadImage(movieBackDrop, 1920, 1080);
            movie.setBackdrop(backdrop);
        }

        if (movieFile != null && !movieFile.isEmpty()) {
            googleDriveManager.replaceMovieFile(movieFile, request.getTitle(), movie);
        }

        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setReleaseYear(request.getReleaseYear());
        movie.setDuration(request.getDuration());
        movie.setGenres(new HashSet<>(genres));
        movie.setCategories(new HashSet<>(categories));
        movie.setCountries(new HashSet<>(countries));
        movie.setDirectors(new HashSet<>(directors));
        movie.setActors(new HashSet<>(actors));
        movie.setUpdatedAt(LocalDateTime.now());

        return movieRepository.save(movie);
    }

    /**
     * [ĐÃ SỬA LỖI] Xóa phim một cách an toàn và đúng đắn với JPA.
     * Sử dụng @Transactional để đảm bảo tính nhất quán của dữ liệu.
     */
    @Transactional
    public void deleteMovie(String movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        String folderId = movie.getFolderId();

        // Xóa tất cả quan hệ ManyToMany qua native query
        movieRepository.deleteFromPlaylists(movieId);
        movieRepository.deleteFromActors(movieId);
        movieRepository.deleteFromDirectors(movieId);
        movieRepository.deleteFromGenres(movieId);
        movieRepository.deleteFromCategories(movieId);
        movieRepository.deleteFromCountries(movieId);

        // Xóa Movie
        movieRepository.deleteById(movieId);

        // Xóa folder trên Google Drive
        if (folderId != null) {
            try {
                googleDriveManager.deleteFileOrFolderById(folderId);
            } catch (Exception e) {
                log.error("Error deleting folder from Google Drive: {}", e.getMessage(), e);
            }
        }

        log.info("Successfully deleted movie with ID: {}", movieId);
    }


    public Page<MovieResponse> searchMovies(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Movie> moviePage = movieRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword, pageable);
        return moviePage.map(movieMapper::toMovieResponse);
    }
}