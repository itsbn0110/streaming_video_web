package dev.streaming.upload.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.Entity.Playlist;
import dev.streaming.upload.Entity.User;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    List<Playlist> findByUser(User user);

    @Query("SELECT p FROM Playlist p WHERE p.user = ?1 AND p.id = ?2")
    Optional<Playlist> findByUserAndId(User user, Long playlistId);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Playlist p JOIN p.movies m WHERE p.id = ?1 AND m.id = ?2")
    boolean existsByPlaylistIdAndMovieId(Long playlistId, String movieId);
}
