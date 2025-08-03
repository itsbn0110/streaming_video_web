package dev.streaming.upload.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.streaming.upload.Entity.Playlist;
import dev.streaming.upload.Entity.User;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    List<Playlist> findByUser(User user);

    @Query("SELECT p FROM Playlist p WHERE p.id = :playlistId AND p.user.id = :userId")
    Optional<Playlist> findByIdAndUserId(@Param("playlistId") Long playlistId, @Param("userId") String userId);

    @Query("SELECT p FROM Playlist p WHERE p.name = :name AND p.user.id = :userId")
    Optional<Playlist> findByNameAndUserId(@Param("name") String name, @Param("userId") String userId);

    void deleteByIdAndUserId(Long playlistId, String userId);
}