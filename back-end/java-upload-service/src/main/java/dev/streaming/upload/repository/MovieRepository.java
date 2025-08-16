package dev.streaming.upload.repository;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import dev.streaming.upload.Entity.Movie;

@Repository
public interface MovieRepository extends JpaRepository<Movie, String> {
    @Query("SELECT m FROM Movie m JOIN m.categories c WHERE c.slug = :slug")
    List<Movie> findByCategorySlug(@Param("slug") String slug);

    @Query("SELECT m FROM Movie m JOIN m.categories c WHERE c.slug = :slug")
    Page<Movie> findByCategorySlug(@Param("slug") String slug, Pageable pageable);

    @Query("SELECT m FROM Movie m WHERE (:releaseYear IS NULL OR m.releaseYear = :releaseYear)")
    List<Movie> findByYear(@Param("releaseYear") Integer releaseYear);

    @Query("SELECT m FROM Movie m JOIN m.genres g WHERE g.name = ?1")
    List<Movie> findByGenre(String genreName);

    List<Movie> findByViewsGreaterThan(int minViews);

    @Query("SELECT m FROM Movie m ORDER BY m.averageRating DESC")
    List<Movie> findTopRatedMovies();

    List<Movie> findByDurationBetween(double minDuration, double maxDuration);

    @Query("SELECT DISTINCT m FROM Movie m JOIN m.countries c WHERE (:countryId IS NULL OR c.id = :countryId)")
    List<Movie> findByCountry(@Param("countryId") String countryId);

    @Query("SELECT DISTINCT m FROM Movie m JOIN m.genres g WHERE g.id IN :genreIds AND m.id <> :movieId")
    List<Movie> findRelatedMovies(@Param("genreIds") List<Long> genreIds, @Param("movieId") String movieId);

    List<Movie> findByCategoriesSlugOrderByUpdatedAtDesc(String categorySlug);

    List<Movie> findTop10ByOrderByUpdatedAtDesc();

    @Query("SELECT m FROM Movie m " +
            "JOIN m.categories c " +
            "WHERE c.slug = :categorySlug " +
            "ORDER BY m.updatedAt DESC")
    List<Movie> findByCategoriesSlugBasicOrderByUpdatedAtDesc(@Param("categorySlug") String categorySlug);

    List<Movie> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    Page<Movie> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description, Pageable pageable);

    @Query("SELECT DISTINCT m FROM Movie m " +
            "LEFT JOIN FETCH m.categories c " +
            "WHERE c.slug = :categorySlug " +
            "ORDER BY m.updatedAt DESC")
    List<Movie> findByCategoriesSlugWithDetailsOrderByUpdatedAtDesc(@Param("categorySlug") String categorySlug);

    /**
     * [MỚI] Truy vấn để lọc phim hiệu quả trên DB.
     * Chỉ tải các phim khớp với các tiêu chí đã cho.
     */
    @Query("SELECT DISTINCT m FROM Movie m " +
            "LEFT JOIN m.categories c " +
            "LEFT JOIN m.countries co " +
            "WHERE (:categorySlug IS NULL OR c.slug = :categorySlug) " +
            "AND (:releaseYear IS NULL OR m.releaseYear = :releaseYear) " +
            "AND (:countryId IS NULL OR co.id = :countryId)")
    Page<Movie> filterMovies(
            @Param("categorySlug") String categorySlug,
            @Param("releaseYear") Integer releaseYear,
            @Param("countryId") Long countryId,
            Pageable pageable);

    
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
}