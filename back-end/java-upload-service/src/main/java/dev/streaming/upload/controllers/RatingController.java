package dev.streaming.upload.controllers;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.streaming.upload.DTO.ApiResponse;
import dev.streaming.upload.DTO.request.RatingRequest;
import dev.streaming.upload.DTO.response.RatingResponse;
import dev.streaming.upload.services.RatingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/v1/ratings")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RatingController {

    RatingService ratingService;

    @GetMapping("/movies/{movieId}")
    public ApiResponse<List<RatingResponse>> getMovieRatings(
            @PathVariable String movieId) {
        List<RatingResponse> ratings = ratingService.getMovieRatings(movieId);
        return ApiResponse.<List<RatingResponse>>builder()
                .result(ratings)
                .build();
    }

    @GetMapping("/movies/{movieId}/user")
    public ApiResponse<RatingResponse> getUserRatingForMovie(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable String movieId) {
        String userId = jwt.getSubject();
        RatingResponse rating = ratingService.getUserRatingForMovie(userId, movieId);
        return ApiResponse.<RatingResponse>builder()
                .result(rating)
                .build();
    }

    @PostMapping
    public ApiResponse<RatingResponse> rateMovie(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody RatingRequest request) {
        String userId = jwt.getSubject();
        RatingResponse rating = ratingService.rateMovie(userId, request);
        return ApiResponse.<RatingResponse>builder()
                .result(rating)
                .build();
    }

    @DeleteMapping("/movies/{movieId}")
    public ApiResponse<Void> deleteRating(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable String movieId) {
        String userId = jwt.getSubject();
        ratingService.deleteRating(userId, movieId);
        return ApiResponse.<Void>builder().build();
    }
}
