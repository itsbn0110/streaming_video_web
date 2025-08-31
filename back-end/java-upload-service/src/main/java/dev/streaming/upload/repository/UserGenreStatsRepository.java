package dev.streaming.upload.repository;

import dev.streaming.upload.Entity.UserGenreStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserGenreStatsRepository extends JpaRepository<UserGenreStats, Long> {

    @Modifying
    @Query(value = "INSERT INTO user_genre_stats (user_id, genre_id, total_views, last_updated) " +
                   "VALUES (:userId, :genreId, 1, CURRENT_TIMESTAMP) " +
                   "ON DUPLICATE KEY UPDATE total_views = total_views + 1, last_updated = CURRENT_TIMESTAMP",
           nativeQuery = true)
    void incrementGenreView(@Param("userId") String userId, @Param("genreId") Long genreId);

    List<UserGenreStats> findByUserId(@Param("userId") String userId);
}
