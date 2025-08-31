package dev.streaming.upload.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import dev.streaming.upload.DTO.ApiResponse;
import dev.streaming.upload.DTO.request.MoodRequest;
import dev.streaming.upload.DTO.request.MovieUploadRequest;
import dev.streaming.upload.DTO.request.TrackViewRequest;
import dev.streaming.upload.DTO.response.MovieResponse;
import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.mapper.MovieMapper;
import dev.streaming.upload.services.MovieService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/movies")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieController {
    MovieService movieService;
    MovieMapper movieMapper;

    @GetMapping("/get-all")
    public ApiResponse<Page<MovieResponse>> getAllMovies(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "15") int size) {
        var results = movieService.getAllMovies(page, size).map(movieMapper::toMovieResponse);
        return ApiResponse.<Page<MovieResponse>>builder().result(results).build();
    }

    @GetMapping("/{movieId}")
    public ApiResponse<MovieResponse> getMovieById(@PathVariable String movieId) {

        var results = movieMapper.toMovieResponse(movieService.getMovieById(movieId));

        return ApiResponse.<MovieResponse>builder().result(results).build();
    }

    @GetMapping("golang/{movieId}")
    public ApiResponse<String> getVideoId(
            @PathVariable String movieId, @RequestParam(name = "ep", required = false) Integer ep) {
        var videoId = movieService.getVideoId(movieId, ep);
        return ApiResponse.<String>builder().result(videoId).build();
    }

    @GetMapping("/{movieId}/related")
    public ApiResponse<List<MovieResponse>> getMovieRelated(@PathVariable String movieId) {

        var results = movieService.getMovieRelated(movieId);
        return ApiResponse.<List<MovieResponse>>builder().result(results).build();
    }

    @GetMapping("/category/{slug}")
    public ApiResponse<Page<MovieResponse>> getMovieByCategories(
            @PathVariable String slug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        var results = movieService.getMovieByCategories(slug, page, size);
        return ApiResponse.<Page<MovieResponse>>builder().result(results).build();
    }

    @GetMapping("/newly-updated/{categorySlug}")
    public ApiResponse<List<MovieResponse>> getNewlyUpdatedByCategory(@PathVariable String categorySlug) {
        var results = movieService.getNewlyUpdatedByCategory(categorySlug);
        return ApiResponse.<List<MovieResponse>>builder().result(results).build();
    }

    @GetMapping("/filter")
    public ApiResponse<Page<MovieResponse>> filterMovies(
            @RequestParam(required = false) String categorySlug,
            @RequestParam(required = false) Integer releaseYear,
            @RequestParam(required = false) Long countryId,
            @RequestParam(required = false) String duration,
            @RequestParam(required = false) String genreId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        var results = movieService.filterMovies(categorySlug, releaseYear, countryId, duration, genreId, page, size);
        return ApiResponse.<Page<MovieResponse>>builder().result(results).build();
    }

    @GetMapping("/search")
    public ApiResponse<Page<MovieResponse>> searchMovies(
            @RequestParam("keyword") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        var results = movieService.searchMovies(keyword, page, size);
        return ApiResponse.<Page<MovieResponse>>builder().result(results).build();
    }

    @PreAuthorize(value = "hasRole('ADMIN')")
    @PutMapping("/update/{movieId}")
    public ApiResponse<MovieResponse> updateMovie(
            @RequestParam("request") String requestJson,
            @PathVariable("movieId") String movieId,
            @RequestPart(value = "thumbnailFile", required = false) MultipartFile thumbnailFile,
            @RequestPart(value = "movieFile", required = false) MultipartFile movieFile,
            @RequestPart(value = "movieBackDrop", required = false) MultipartFile movieBackDrop)
            throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        MovieUploadRequest request = mapper.readValue(requestJson, MovieUploadRequest.class);

        Movie movie = movieService.updateMovie(request, movieId, thumbnailFile, movieFile, movieBackDrop);

        return ApiResponse.<MovieResponse>builder()
                .result(movieMapper.toMovieResponse(movie))
                .build();
    }

    @PreAuthorize(value = "hasRole('ADMIN')")
    @DeleteMapping("/delete/{movieId}")
    public ApiResponse<Void> deleteMovie(@PathVariable String movieId) {
        movieService.deleteMovie(movieId);
        return ApiResponse.<Void>builder()
                .message("Deleted movie successfully!!")
                .build();
    }

    @PatchMapping("/{movieId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> updateMovieStatus(@PathVariable String movieId, @RequestParam("status") int status) {
        movieService.updateMovieStatus(movieId, status);
        return ApiResponse.<Void>builder()
                .message("Movie status updated successfully!")
                .build();
    }

    @PostMapping("/track-view")
    public ResponseEntity<ApiResponse<Void>> trackView(
            @RequestBody TrackViewRequest request, 
            @AuthenticationPrincipal Jwt jwt) {
        try {
            if (jwt == null) {
                log.error("Jwt is null. Authentication token is missing.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.<Void>builder().message("Unauthorized: Missing authentication token").build());
            }

            String userId = jwt.getSubject();
            log.info("Tracking view for user: {}", userId);
            List<Long> genreIds = request.getGenreIds();
            log.info("genreIds: {}", genreIds);
            movieService.trackView(userId, genreIds);
            return ResponseEntity.ok(ApiResponse.<Void>builder().message("View tracked successfully").build());
        } catch (Exception e) {
            log.error("Error tracking view: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<Void>builder().message("Failed to track view").build());
        }
    }

    /**
     * Get user viewing profile and statistics
     */
    @GetMapping("/user-profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserProfile(@AuthenticationPrincipal Jwt jwt) {
        try {
            String userId = jwt.getSubject();
            log.info("Fetching profile for user: {}", userId);

            Map<String, Object> userProfile = movieService.getUserProfile(userId);

            return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                    .code(1000)
                    .message("User profile retrieved successfully")
                    .result(userProfile)
                    .build());
        } catch (Exception e) {
            log.error("Error fetching user profile for user {}: {}", jwt.getSubject(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<Map<String, Object>>builder()
                            .code(5000)
                            .message("Failed to get user profile")
                            .build());
        }
    }

    /**
     * Generate AI-powered movie collections for user
     */
    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> generateMovieCollections(
            @AuthenticationPrincipal Jwt jwt) {
        try {
            String userId = jwt.getSubject();
            log.info("Generating AI recommendations for user: {}", userId);

            List<Map<String, Object>> collections = movieService.generateMovieCollections(userId);

            return ResponseEntity.ok(ApiResponse.<List<Map<String, Object>>>builder()
                    .code(1000)
                    .message("Movie collections generated successfully")
                    .result(collections)
                    .build());
        } catch (Exception e) {
            log.error("Error generating recommendations for user {}: {}", jwt.getSubject(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<List<Map<String, Object>>>builder()
                            .code(5000)
                            .message("Failed to generate recommendations")
                            .build());
        }
    }

    /**
     * Get mood-based movie recommendations
     */
    @PostMapping("/mood-recommendations")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMoodRecommendations(
            @RequestBody MoodRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        try {
            String userId = jwt.getSubject();
            String mood = request.getMood();

            log.info("Generating mood-based recommendations for user {} with mood: {}", userId, mood);

            // Generate collections with mood context
            List<Map<String, Object>> collections = movieService.generateMoodBasedCollections(userId, mood);

            return ResponseEntity.ok(ApiResponse.<List<Map<String, Object>>>builder()
                    .code(1000)
                    .message("Mood-based recommendations generated successfully")
                    .result(collections)
                    .build());
        } catch (Exception e) {
            log.error("Error generating mood recommendations: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<List<Map<String, Object>>>builder()
                            .code(5000)
                            .message("Failed to generate mood recommendations")
                            .build());
        }
    }

    /**
     * Get quick movie suggestion (Lucky button)
     */
    @GetMapping("/lucky-pick")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getLuckyPick(@AuthenticationPrincipal Jwt jwt) {
        try {
            String userId = jwt.getSubject();
            log.info("Getting lucky pick for user: {}", userId);

            Map<String, Object> luckyPick = movieService.getLuckyMoviePick(userId);

            return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                    .code(1000)
                    .message("Lucky pick generated successfully")
                    .result(luckyPick)
                    .build());
        } catch (Exception e) {
            log.error("Error getting lucky pick: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<Map<String, Object>>builder()
                            .code(5000)
                            .message("Failed to get lucky pick")
                            .build());
        }
    }
}
