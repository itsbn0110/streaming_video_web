package dev.streaming.upload.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.Entity.Rating;
import dev.streaming.upload.Entity.User;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByMovie(Movie movie);

    List<Rating> findByUser(User user);

    Optional<Rating> findByUserAndMovie(User user, Movie movie);

    @Query("SELECT AVG(r.starValue) FROM Rating r WHERE r.movie = ?1")
    Double calculateAverageRating(Movie movie);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.movie = ?1")
    Integer countByMovie(Movie movie);
}
