package dev.streaming.upload.repository;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import dev.streaming.upload.Entity.Genre;
import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.enums.MovieType;

@Repository
public interface MovieRepository extends JpaRepository<Movie, String> {
    @Query("SELECT m FROM Movie m JOIN m.categories c WHERE c.slug = :slug AND m.status = 1")
    List<Movie> findByCategorySlug(@Param("slug") String slug);

    @Query("SELECT m FROM Movie m JOIN m.categories c WHERE c.slug = :slug AND m.status = 1")
    Page<Movie> findByCategorySlug(@Param("slug") String slug, Pageable pageable);

    @Query("SELECT m FROM Movie m WHERE (:releaseYear IS NULL OR m.releaseYear = :releaseYear) AND m.status = 1")
    List<Movie> findByYear(@Param("releaseYear") Integer releaseYear);

    @Query("SELECT m FROM Movie m JOIN m.genres g WHERE g.name = ?1 AND m.status = 1")
    List<Movie> findByGenre(String genreName);

    List<Movie> findByViewsGreaterThan(int minViews);

    @Query("SELECT m FROM Movie m WHERE m.status = 1 ORDER BY m.averageRating DESC")
    List<Movie> findTopRatedMovies();

    List<Movie> findByDurationBetween(double minDuration, double maxDuration);

    @Query(
            "SELECT DISTINCT m FROM Movie m JOIN m.countries c WHERE (:countryId IS NULL OR c.id = :countryId) AND m.status = 1")
    List<Movie> findByCountry(@Param("countryId") String countryId);

    @Query(
            "SELECT DISTINCT m FROM Movie m JOIN m.genres g WHERE g.id IN :genreIds AND m.id <> :movieId AND m.movieType = :movieType AND m.status = 1")
    List<Movie> findRelatedMovies(
            @Param("genreIds") List<Long> genreIds,
            @Param("movieId") String movieId,
            @Param("movieType") MovieType movieType);

    List<Movie> findTop10ByOrderByUpdatedAtDesc();

    @Query(
            "SELECT m FROM Movie m JOIN m.categories c WHERE c.slug = :categorySlug AND m.status = 1 ORDER BY m.updatedAt DESC")
    List<Movie> findByCategoriesSlugBasicOrderByUpdatedAtDesc(@Param("categorySlug") String categorySlug);

    List<Movie> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    Page<Movie> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String title, String description, Pageable pageable);

    @Query(
            "SELECT DISTINCT m FROM Movie m LEFT JOIN FETCH m.categories c WHERE c.slug = :categorySlug AND m.status = 1 ORDER BY m.updatedAt DESC LIMIT 20")
    List<Movie> findByCategoriesSlugWithDetailsOrderByUpdatedAtDesc(@Param("categorySlug") String categorySlug);

    /**
     * [MỚI] Truy vấn để lọc phim hiệu quả trên DB.
     * Chỉ tải các phim khớp với các tiêu chí đã cho.
     */
    @Query(
            "SELECT DISTINCT m FROM Movie m LEFT JOIN m.categories c LEFT JOIN m.countries co LEFT JOIN m.genres g WHERE (:categorySlug IS NULL OR c.slug = :categorySlug) AND (:releaseYear IS NULL OR m.releaseYear = :releaseYear) AND (:countryId IS NULL OR co.id = :countryId) AND (:genreId IS NULL OR g.id = :genreId) AND m.status = 1")
    Page<Movie> filterMovies(
            @Param("categorySlug") String categorySlug,
            @Param("releaseYear") Integer releaseYear,
            @Param("countryId") Long countryId,
            @Param("genreId") String genreId,
            Pageable pageable);
    
     

     /**
     * Find movies by title containing (case insensitive) - for AI movie matching
     */
    @Query("SELECT m FROM Movie m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Movie> findByTitleContainingIgnoreCase(@Param("title") String title);
    
    /**
     * Find movies by genre containing - for fallback recommendations
     */
    @Query("SELECT m FROM Movie m JOIN m.genres g WHERE g = :genre")
    List<Movie> findByGenresContaining(@Param("genre") Genre genre);
    
    /**
     * Find top movies by views - for popular fallback
     */
    @Query("SELECT m FROM Movie m ORDER BY m.views DESC")
    List<Movie> findTop10ByOrderByViewsDesc(Pageable pageable);
    
    // Wrapper method for easier use
    default List<Movie> findTop10ByOrderByViewsDesc() {
        return findTop10ByOrderByViewsDesc(PageRequest.of(0, 10));
    }
    
    /**
     * Advanced search for better movie matching
     */
    @Query("SELECT m FROM Movie m WHERE " +
           "LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.originalTitle) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Movie> findByTitleOrOriginalTitleContainingIgnoreCase(@Param("keyword") String keyword);

    Long countByCreatedAtAfter(LocalDateTime dateTime);

    //    Long countByViewsAfter(LocalDateTime dateTime);
    @Query(value = "Select count(views) from movies m where m.created_at > :dateTime", nativeQuery = true)
    Long countViews(@Param("dateTime") LocalDateTime dateTime);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM playlist_movie WHERE movie_id = :movieId", nativeQuery = true)
    void deleteFromPlaylists(@Param("movieId") String movieId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM movie_actor WHERE movie_id = :movieId", nativeQuery = true)
    void deleteFromActors(@Param("movieId") String movieId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM movie_director WHERE movie_id = :movieId", nativeQuery = true)
    void deleteFromDirectors(@Param("movieId") String movieId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM movie_genre WHERE movie_id = :movieId", nativeQuery = true)
    void deleteFromGenres(@Param("movieId") String movieId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM movie_category WHERE movie_id = :movieId", nativeQuery = true)
    void deleteFromCategories(@Param("movieId") String movieId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM movie_country WHERE movie_id = :movieId", nativeQuery = true)
    void deleteFromCountries(@Param("movieId") String movieId);

    @Query(
            "SELECT m FROM Movie m WHERE (LOWER(m.title) LIKE LOWER(CONCAT(:keyword, '%')) " +
            "OR LOWER(m.description) LIKE LOWER(CONCAT(:keyword, '%'))) AND m.status = 1")
    Page<Movie> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Add a custom query to fetch all movie titles
    @Query("SELECT m.title FROM Movie m")
    List<String> findAllTitles();


    /**
     * Find movies by genre name and duration range - for time-based collections
     */
    @Query("SELECT m FROM Movie m JOIN m.genres g WHERE g.name LIKE %:genreName% " +
           "AND m.duration BETWEEN :minDuration AND :maxDuration " +
           "ORDER BY m.views DESC")
    List<Movie> findByGenreAndDurationRange(
        @Param("genreName") String genreName,
        @Param("minDuration") Integer minDuration,
        @Param("maxDuration") Integer maxDuration
    );

    /**
     * Find movies by genre name for fallback collections
     */
    @Query("SELECT m FROM Movie m JOIN m.genres g WHERE LOWER(g.name) LIKE LOWER(CONCAT('%', :genreName, '%')) " +
           "ORDER BY m.views DESC")
    List<Movie> findByGenreNameContaining(@Param("genreName") String genreName);

    /**
     * Find movies for discovery - different from user's main genres
     */
    @Query("SELECT m FROM Movie m JOIN m.genres g WHERE g.name NOT IN :excludeGenres " +
           "AND m.views > :minViews ORDER BY m.updatedAt DESC")
    List<Movie> findDiscoveryMovies(
        @Param("excludeGenres") List<String> excludeGenres,
        @Param("minViews") Long minViews
    );

    /**
     * Find movies by multiple criteria for better matching
     */
    @Query("SELECT DISTINCT m FROM Movie m JOIN m.genres g WHERE " +
           "(LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.originalTitle) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND m.status = 1 ORDER BY m.views DESC")
    List<Movie> findByKeywordAndActive(@Param("keyword") String keyword);

    /**
     * Find trending movies - high views and recent
     */
    @Query("SELECT m FROM Movie m WHERE m.views > :minViews " +
           "AND m.updatedAt > :since ORDER BY m.views DESC")
    List<Movie> findTrendingMovies(
        @Param("minViews") Long minViews,
        @Param("since") LocalDateTime since
    );

    /**
     * Find movies by release year range
     */
    @Query("SELECT m FROM Movie m WHERE m.releaseYear BETWEEN :startYear AND :endYear " +
           "ORDER BY m.views DESC")
    List<Movie> findByReleaseYearRange(
        @Param("startYear") Integer startYear,
        @Param("endYear") Integer endYear
    );

    /**
     * Find random movies from a genre - for variety
     */
    @Query(value = "SELECT m.* FROM movie m JOIN movie_genre mg ON m.id = mg.movie_id " +
           "JOIN genre g ON mg.genre_id = g.id WHERE LOWER(g.name) LIKE LOWER(CONCAT('%', ?1, '%')) " +
           "ORDER BY RAND() LIMIT ?2", nativeQuery = true)
    List<Movie> findRandomMoviesByGenre(String genreName, int limit);

    /**
     * Find movies excluding certain IDs - to avoid duplicates
     */
    @Query("SELECT m FROM Movie m WHERE m.id NOT IN :excludeIds ORDER BY m.views DESC")
    List<Movie> findMoviesExcluding(@Param("excludeIds") List<String> excludeIds);
}
