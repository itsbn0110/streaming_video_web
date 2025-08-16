package dev.streaming.upload.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import dev.streaming.upload.Entity.DailyMovieViews;
import dev.streaming.upload.Entity.DailyMovieViewsId;
import java.time.LocalDate;

public interface DailyMovieViewsRepository extends JpaRepository<DailyMovieViews, DailyMovieViewsId> {

    @Query(value = "SELECT SUM(view_count) FROM daily_movie_views WHERE view_date = :date", nativeQuery = true)
    Long sumViewsByDate(LocalDate date);
}