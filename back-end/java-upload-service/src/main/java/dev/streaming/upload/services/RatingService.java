package dev.streaming.upload.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.streaming.upload.DTO.request.RatingRequest;
import dev.streaming.upload.DTO.response.RatingResponse;
import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.Entity.Rating;
import dev.streaming.upload.Entity.User;
import dev.streaming.upload.exception.AppException;
import dev.streaming.upload.exception.ErrorCode;
import dev.streaming.upload.mapper.RatingMapper;
import dev.streaming.upload.repository.MovieRepository;
import dev.streaming.upload.repository.RatingRepository;
import dev.streaming.upload.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RatingService {

    RatingRepository ratingRepository;
    UserRepository userRepository;
    MovieRepository movieRepository;
    RatingMapper ratingMapper;

    public List<RatingResponse> getMovieRatings(String movieId) {
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        List<Rating> ratings = ratingRepository.findByMovie(movie);
        return ratingMapper.toRatingResponseList(ratings);
    }

    public RatingResponse getUserRatingForMovie(String userId, String movieId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        Rating rating = ratingRepository
                .findByUserAndMovie(user, movie)
                .orElseThrow(() -> new AppException(ErrorCode.RATING_NOT_FOUND));

        return ratingMapper.toRatingResponse(rating);
    }

    @Transactional
    public RatingResponse rateMovie(String userId, RatingRequest request) {
        // 1. Validate input
        if (request.getStarValue() < 1 || request.getStarValue() > 5) {
            throw new AppException(ErrorCode.INVALID_RATING_VALUE);
        }

        // 2. Find user and movie
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Movie movie = movieRepository
                .findById(request.getMovieId())
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        // 3. Check if a rating already exists for this user and movie
        ratingRepository.findByUserAndMovie(user, movie).ifPresent(rating -> {
            // If a rating is found, throw an exception
            throw new AppException(ErrorCode.RATING_ALREADY_EXISTED);
        });

        // 4. If no rating exists, create a new one
        Rating newRating = new Rating();
        newRating.setUser(user);
        newRating.setMovie(movie);
        newRating.setStarValue(request.getStarValue());
        newRating.setComment(request.getComment());
        newRating.setCreatedAt(LocalDateTime.now());
        Rating savedRating = ratingRepository.save(newRating);

        // 5. Update the movie's average rating
        updateMovieRating(movie);

        // 6. Return the response
        return ratingMapper.toRatingResponse(savedRating);
    }

    @Transactional
    public void deleteRating(String userId, String movieId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        Rating rating = ratingRepository
                .findByUserAndMovie(user, movie)
                .orElseThrow(() -> new AppException(ErrorCode.RATING_NOT_FOUND));

        ratingRepository.delete(rating);

        // Update movie's average rating
        updateMovieRating(movie);

        log.info("User {} removed rating for movie {}", user.getUsername(), movie.getTitle());
    }

    private void updateMovieRating(Movie movie) {
        Double averageRating = ratingRepository.calculateAverageRating(movie);
        Integer ratingCount = ratingRepository.countByMovie(movie);

        movie.setRatingCount(ratingCount != null ? ratingCount : 0);
        movie.setAverageRating(averageRating != null ? averageRating : 0.0);
        movie.setRatingCount(ratingCount != null ? ratingCount : 0);

        movieRepository.save(movie);
    }
}
