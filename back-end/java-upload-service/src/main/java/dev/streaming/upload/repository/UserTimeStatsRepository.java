package dev.streaming.upload.repository;

import dev.streaming.upload.Entity.UserTimeStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserTimeStatsRepository extends JpaRepository<UserTimeStats, Long> {

    @Modifying
    @Query(value = "INSERT INTO user_time_stats (user_id, time_slot, total_views, last_updated) " +
                   "VALUES (:userId, :timeSlot, 1, CURRENT_TIMESTAMP) " +
                   "ON DUPLICATE KEY UPDATE total_views = total_views + 1, last_updated = CURRENT_TIMESTAMP",
           nativeQuery = true)
    void incrementTimeSlotView(@Param("userId") String userId, @Param("timeSlot") String timeSlot);

    List<UserTimeStats> findByUserId(@Param("userId") String userId);
}
