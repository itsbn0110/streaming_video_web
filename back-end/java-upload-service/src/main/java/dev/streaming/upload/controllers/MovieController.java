package dev.streaming.upload.controllers;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.streaming.upload.DTO.ApiResponse;
import dev.streaming.upload.DTO.request.MovieUploadRequest;
import dev.streaming.upload.DTO.response.MovieResponse;
import dev.streaming.upload.DTO.response.VideoIdResponse;
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
    public ApiResponse<VideoIdResponse> getVideoId(@PathVariable String movieId) {

        var results = movieMapper.toVideoIdResponse(movieService.getVideoId(movieId));
        ;
        return ApiResponse.<VideoIdResponse>builder().result(results).build();
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
        log.info("tôi đã ở đây");
        var results = movieService.getNewlyUpdatedByCategory(categorySlug);
        log.info("results : {}",results);
        return ApiResponse.<List<MovieResponse>>builder().result(results).build();
    }

    @GetMapping("/filter")
    public ApiResponse<Page<MovieResponse>> filterMovies(
            @RequestParam(required = false) String categorySlug,
            @RequestParam(required = false) Integer releaseYear,
            @RequestParam(required = false) Long countryId,
            @RequestParam(required = false) String duration,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        var results = movieService.filterMovies(categorySlug, releaseYear, countryId, duration, page, size);
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
            @RequestPart(value ="thumbnailFile", required = false) MultipartFile thumbnailFile,
            @RequestPart(value ="movieFile", required = false) MultipartFile movieFile,
            @RequestPart(value ="movieBackDrop", required = false) MultipartFile movieBackDrop
            ) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        MovieUploadRequest request = mapper.readValue(requestJson, MovieUploadRequest.class);

        Movie movie = movieService.updateMovie(request, movieId,thumbnailFile,movieFile,movieBackDrop);

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
}
