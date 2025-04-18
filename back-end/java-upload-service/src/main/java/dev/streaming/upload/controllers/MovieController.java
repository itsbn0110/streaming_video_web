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
import org.springframework.web.bind.annotation.RestController;
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
    public ApiResponse<Page<Movie>> getAllMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        var results = movieService.getAllMovies(page,size);
        
        return ApiResponse.<Page<Movie>>builder().result(results).build();
    }

    @GetMapping("/{movieId}")
    public ApiResponse<MovieResponse> getMovieById(
            @PathVariable String movieId
           ) {
        
        var results = movieMapper.toMovieResponse(movieService.getMovieById(movieId));
        
        return ApiResponse.<MovieResponse>builder().result(results).build();
    }


    @GetMapping("golang/{movieId}")
    public ApiResponse<VideoIdResponse> getVideoId(
            @PathVariable String movieId
           ) {
        
        var results = movieMapper.toVideoIdResponse(movieService.getVideoId(movieId));;
        return ApiResponse.<VideoIdResponse>builder().result(results).build();
    }

    @GetMapping ("/{movieId}/related")
    public ApiResponse<List<MovieResponse>> getMovieRelated ( @PathVariable String movieId ) {

        var results = movieService.getMovieRelated(movieId);
        return  ApiResponse.<List<MovieResponse>>builder().result(results).build();
    }

    @GetMapping ("/category/{slug}")
    public ApiResponse<List<Movie>> getMovieByCategories(
        @PathVariable String slug
    )  {
        var results = movieService.getMovieByCategories(slug);
        return ApiResponse.<List<Movie>>builder().result(results).build();
        
    }


    @GetMapping("/newly-updated/{categorySlug}")
    public ApiResponse<List<MovieResponse>> getNewlyUpdatedByCategory(@PathVariable String categorySlug) {
        var results = movieService.getNewlyUpdatedByCategory(categorySlug);
        return ApiResponse.<List<MovieResponse>>builder().result(results).build();
    }

    @GetMapping ("/filter")
    public ApiResponse<List<Movie>> filterMovies (
        @RequestParam(required = false) String categorySlug,
        @RequestParam(required = false) Integer releaseYear,
        @RequestParam(required = false) Long countryId,
        @RequestParam(required = false) String duration

    ) {
        var results = movieService.filterMovies(categorySlug,releaseYear,countryId,duration);
        return ApiResponse.<List<Movie>>builder().result(results).build();
    }

    @PreAuthorize(value = "hasRole('ADMIN')")
    @PutMapping ("/update/{movieId}")
    public ApiResponse<MovieResponse> updateMovie(
        @RequestParam("request") String requestJson,
        @PathVariable("movieId") String movieId
        )
        throws Exception {
    ObjectMapper mapper = new ObjectMapper();
    MovieUploadRequest request = mapper.readValue(requestJson, MovieUploadRequest.class);

    Movie movie = movieService.updateMovie(request,movieId);

    return ApiResponse.<MovieResponse>builder()
            .result(movieMapper.toMovieResponse(movie))
            .build();
    }   

    @DeleteMapping("/delete/{movieId}")
    public ApiResponse<Void> deleteMovie (@PathVariable String movieId ) {
        movieService.deleteMovie(movieId);
        return ApiResponse.<Void>builder().message("Deleted movie successfully!!").build();
    }
}