package dev.streaming.upload.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.streaming.upload.DTO.ApiResponse;
import dev.streaming.upload.DTO.dto.GenreStatsDTO;
import dev.streaming.upload.DTO.response.MovieResponse;
import dev.streaming.upload.repository.MovieRepository;
import dev.streaming.upload.repository.UserRepository;
import dev.streaming.upload.services.DashboardService;
import dev.streaming.upload.services.MovieService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController()
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardController {
    MovieRepository movieRepository;
    UserRepository userRepository;
    DashboardService dashboardService;
    MovieService movieService;

    @GetMapping("/total-movies")
    public Long getTotalMovies() {
        return movieRepository.count();
    }

    @GetMapping("/new-movies-monthly")
    public Long getNewMoviesMonthly() {
        return dashboardService.getNewMoviesMonthly();
    }

    @GetMapping("/total-users")
    public Long getTotalUsers() {
        return userRepository.count();
    }

    @GetMapping("/daily-views")
    public Long getDailyViews() {
        return dashboardService.getDailyViews();
    }

    @GetMapping("/newly-updated-movies")
    public ApiResponse<List<MovieResponse>> getNewlyUpdatedMovies() {
        var results = movieService.getNewlyUpdatedMovies();
        return ApiResponse.<List<MovieResponse>>builder().result(results).build();
    }

    @GetMapping("/genres-stats")
    public ApiResponse<List<GenreStatsDTO>> getGenresStats() {
        List<GenreStatsDTO> genres = dashboardService.getGenresStats();
        return ApiResponse.<List<GenreStatsDTO>>builder().result(genres).build();
    }
}
