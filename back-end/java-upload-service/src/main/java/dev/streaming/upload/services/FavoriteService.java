package dev.streaming.upload.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.streaming.upload.DTO.request.FavoriteRequest;
import dev.streaming.upload.DTO.response.FavoriteResponse;
import dev.streaming.upload.Entity.Favorite;
import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.Entity.User;
import dev.streaming.upload.exception.AppException;
import dev.streaming.upload.exception.ErrorCode;
import dev.streaming.upload.mapper.FavoriteMapper;
import dev.streaming.upload.repository.FavoriteRepository;
import dev.streaming.upload.repository.MovieRepository;
import dev.streaming.upload.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FavoriteService {

    FavoriteRepository favoriteRepository;
    UserRepository userRepository;
    MovieRepository movieRepository;
    FavoriteMapper favoriteMapper;

    public List<FavoriteResponse> getUserFavorites(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Favorite> favorites = favoriteRepository.findByUser(user);
        return favorites.stream()
                .map(favoriteMapper::toFavoriteResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public FavoriteResponse addFavorite(String userId, FavoriteRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        if (favoriteRepository.existsByUserAndMovie(user, movie)) {
            throw new AppException(ErrorCode.MOVIE_ALREADY_IN_FAVORITES);
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .movie(movie)
                .createdAt(LocalDateTime.now())
                .build();

        favoriteRepository.save(favorite);
        log.info("Added movie {} to favorites for user {}", movie.getTitle(), user.getUsername());

        return favoriteMapper.toFavoriteResponse(favorite);
    }

    @Transactional
    public void removeFavorite(String userId, String movieId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        Favorite favorite = favoriteRepository.findByUserAndMovie(user, movie)
                .orElseThrow(() -> new AppException(ErrorCode.FAVORITE_NOT_FOUND));

        favoriteRepository.delete(favorite);
        log.info("Removed movie {} from favorites for user {}", movie.getTitle(), user.getUsername());
    }

    public boolean checkIsFavorite(String userId, String movieId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        return favoriteRepository.existsByUserAndMovie(user, movie);
    }
}
