package dev.streaming.upload.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import dev.streaming.upload.Entity.Episode;

@Repository
public interface EpisodeRepository extends JpaRepository<Episode, String> {
    boolean existsByMovieIdAndEpisodeNumber(String movieId, int episodeNumber);

    @Query("SELECT e FROM Episode e WHERE e.movieId = :movieId")
    List<Episode> findAllByMovieId(@Param("movieId") String movieId);

    @Query("SELECT e FROM Episode e WHERE e.id = :episodeId AND e.movieId = :movieId")
    Optional<Episode> findByIdAndMovieId(@Param("episodeId") String episodeId, @Param("movieId") String movieId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Episode e WHERE e.id = :episodeId AND e.movieId = :movieId")
    void deleteByIdAndMovieId(@Param("episodeId") String episodeId, @Param("movieId") String movieId);

    boolean existsById(String episodeId);
}
