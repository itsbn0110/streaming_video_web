package dev.streaming.upload.services;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import dev.streaming.upload.DTO.request.MovieUploadRequest;
import dev.streaming.upload.DTO.response.MovieResponse;
import dev.streaming.upload.Entity.Category;
import dev.streaming.upload.Entity.Country;
import dev.streaming.upload.Entity.Genre;
import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.Entity.Person;
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
public class MovieService {

    GoogleDriveManager googleDriveManager;
    CategoryRepository categoryRepository;
    GenreRepository genreRepository;
    CountryRepository countryRepository;
    PersonRepository personRepository;
    MovieRepository movieRepository;
    MovieMapper movieMapper;

    public Page<Movie> getAllMovies (int page, int size) { 
        Pageable pageable = PageRequest.of(page, size);
        Page<Movie> movies = movieRepository.findAll(pageable);
        return movies;
    }

    public Movie getMovieById(String movieId) {
        

    return movieRepository.findById(movieId)
            .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
    }


    public Movie getVideoId(String movieId) {
        return movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
    }


    public List<MovieResponse> getMovieRelated ( String movieId) {
       Movie movie = movieRepository.findById(movieId).orElseThrow( () -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

       List <Long> genreIds = movie.getGenres().stream().map(Genre::getId).collect(Collectors.toList());

       
       List <Movie> relatedMovies = movieRepository.findRelatedMovies(genreIds, movieId);


       return relatedMovies.stream().map(relatedMovie -> movieMapper.toMovieResponse(relatedMovie)).collect(Collectors.toList());
       
    }


    public List<Movie> getMovieByCategories (String slug) {
       return movieRepository.findByCategorySlug(slug);
    }


    public List<MovieResponse> getNewlyUpdatedByCategory(String categorySlug) {
        List<Movie> movies = movieRepository.findByCategoriesSlugOrderByUpdatedAtDesc(categorySlug);
        return movies.stream()
                .map(movieMapper::toMovieResponse)
                .collect(Collectors.toList());
    }
    public List<Movie> filterMovies (
        String categorySlug,
        Integer releaseYear,
        Long countryId,
        String duration
        ) {
        List<Movie> movies = movieRepository.findAll();

        if (categorySlug != null) {
            movies = movies.stream()
                    .filter(movie -> movie.getCategories().stream().anyMatch(c -> c.getSlug().equals(categorySlug)))
                    .collect(Collectors.toList());
        }

        if (releaseYear != null) {
            movies = movies.stream().filter(movie -> movie.getReleaseYear() == releaseYear).collect(Collectors.toList());
        }

        if (countryId != null) {
            movies = movies.stream()
                    .filter(movie -> movie.getCountries().stream().anyMatch(country -> country.getId().equals(countryId)))
                    .collect(Collectors.toList());
        }

        if (duration != null) {
            switch (duration.toLowerCase()) {
                case "short":
                    movies = movies.stream()
                            .filter(movie -> movie.getDuration() < 90)
                            .collect(Collectors.toList());
                    break;
                case "medium":
                    movies = movies.stream()
                            .filter(movie -> movie.getDuration() >= 90 && movie.getDuration() <= 120)
                            .collect(Collectors.toList());
                    break;
                case "long":
                    movies = movies.stream()
                            .filter(movie -> movie.getDuration() > 120)
                            .collect(Collectors.toList());
                    if (!movies.isEmpty()) {
                        log.info("First long movie duration: {}", movies.get(0).getDuration());
                    }
                    break;
                default:
                    log.warn("Invalid duration filter: {}", duration);
            }
        }

        return movies;
     }


      public Movie updateMovie (MovieUploadRequest request, String movieId) {
        var categories = categoryRepository.findByNameIn(request.getCategories());
        var genres = genreRepository.findByNameIn(request.getGenres());
        var countries = countryRepository.findByNameIn(request.getCountries());
        var actors = personRepository.findByNameIn(request.getActors());
        var directors = personRepository.findByNameIn(request.getDirectors());
        return movieRepository.findById(movieId)
            .map(movie -> {
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
                return movieRepository.save(movie); // Lưu lại vào database
            }).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        }


        public void deleteMovie (String movieId) {
            Movie movie = movieRepository.findById(movieId).orElseThrow( () ->  new AppException(ErrorCode.MOVIE_NOT_FOUND));
            

            for (Person actor : movie.getActors()) {
                actor.getActedMovies().remove(movie);
            }
            movie.getActors().clear();

            for (Person director : movie.getDirectors()) {
                director.getDirectedMovies().remove(movie);
            }
            movie.getDirectors().clear();

            for (Genre genre : movie.getGenres()) {
                genre.getMovies().remove(movie);
            }
            movie.getGenres().clear();

            for (Country country : movie.getCountries()) {
                country.getMovies().remove(movie);
            }
            movie.getCountries().clear();

            for (Category category : movie.getCategories()) {
                category.getMovies().remove(movie);
            }
            movie.getCategories().clear();

            
            
            String folderId = movie.getFolderId();
            if (folderId == null) {
                throw new AppException(ErrorCode.FILE_OR_FOLDER_NOT_EXSIST);
            }
            
            movieRepository.delete(movie);
            if (folderId != null) {
                try {
                    googleDriveManager.deleteFileOrFolderById(folderId);
                } catch (Exception e) {
                    log.error("Error deleting folder from Google Drive: " + e.getMessage(), e);
                }
            }
        }

}
