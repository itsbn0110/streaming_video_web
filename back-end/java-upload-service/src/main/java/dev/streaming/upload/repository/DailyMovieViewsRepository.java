package dev.streaming.upload.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import dev.streaming.upload.Entity.DailyMovieViews;
import dev.streaming.upload.Entity.DailyMovieViewsId;

public interface DailyMovieViewsRepository extends JpaRepository<DailyMovieViews, DailyMovieViewsId> {

    @Query(value = "SELECT SUM(view_count) FROM daily_movie_views WHERE view_date = :date", nativeQuery = true)
    Long sumViewsByDate(LocalDate date);
}
