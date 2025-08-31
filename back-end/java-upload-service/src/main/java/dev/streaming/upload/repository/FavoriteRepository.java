package dev.streaming.upload.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.streaming.upload.Entity.Favorite;
import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.Entity.User;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);

    List<Favorite> findByMovie(Movie movie);

    Optional<Favorite> findByUserAndMovie(User user, Movie movie);

    boolean existsByUserAndMovie(User user, Movie movie);

    void deleteByUserAndMovie(User user, Movie movie);
}
