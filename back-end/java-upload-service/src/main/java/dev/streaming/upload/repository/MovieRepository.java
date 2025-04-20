package dev.streaming.upload.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.streaming.upload.Entity.Movie;

@Repository
public interface MovieRepository extends JpaRepository<Movie, String> {
    @Query("SELECT m FROM Movie m JOIN m.categories c WHERE c.slug = :slug")
    List<Movie> findByCategorySlug(@Param("slug") String slug);

    // Tìm phim theo năm phát hành
    @Query("SELECT m FROM Movie m WHERE (:releaseYear IS NULL OR m.releaseYear = :releaseYear)")
    List<Movie> findByYear(@Param("releaseYear") Integer releaseYear);

    // Tìm phim theo thể loại
    @Query("SELECT m FROM Movie m JOIN m.genres g WHERE g.name = ?1")
    List<Movie> findByGenre(String genreName);

    // Lọc phim theo số lượt xem lớn hơn một giá trị nhất định
    List<Movie> findByViewsGreaterThan(int minViews);

    // Tìm phim có rating cao nhất
    @Query("SELECT m FROM Movie m ORDER BY m.averageRating DESC")
    List<Movie> findTopRatedMovies();

    // Tìm phim có thời lượng nằm trong khoảng nhất định
    List<Movie> findByDurationBetween(double minDuration, double maxDuration);

    // Tìm phim theo quốc gia
    @Query("SELECT DISTINCT m FROM Movie m JOIN m.countries c WHERE (:countryId IS NULL OR c.id = :countryId)")
    List<Movie> findByCountry(@Param("countryId") String countryId);

    @Query("SELECT DISTINCT m FROM Movie m JOIN m.genres g WHERE g.id IN :genreIds AND m.id <> :movieId")
    List<Movie> findRelatedMovies(@Param("genreIds") List<Long> genreIds, @Param("movieId") String movieId);

    List<Movie> findByCategoriesSlugOrderByUpdatedAtDesc(String categorySlug);
}
