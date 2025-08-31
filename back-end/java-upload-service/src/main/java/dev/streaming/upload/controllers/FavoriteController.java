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
import dev.streaming.upload.DTO.request.FavoriteRequest;
import dev.streaming.upload.DTO.response.FavoriteResponse;
import dev.streaming.upload.services.FavoriteService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/v1/favorites")
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FavoriteController {

    private FavoriteService favoriteService;

    @GetMapping
    public ApiResponse<List<FavoriteResponse>> getUserFavorites(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        log.info("jwt: {}", jwt.getSubject());
        List<FavoriteResponse> favorites = favoriteService.getUserFavorites(userId);
        return ApiResponse.<List<FavoriteResponse>>builder().result(favorites).build();
    }

    @PostMapping
    public ApiResponse<FavoriteResponse> addFavorite(
            @AuthenticationPrincipal Jwt jwt, @RequestBody FavoriteRequest request) {
        String userId = jwt.getSubject();
        FavoriteResponse favorite = favoriteService.addFavorite(userId, request);
        return ApiResponse.<FavoriteResponse>builder().result(favorite).build();
    }

    @DeleteMapping("/{movieId}")
    public ApiResponse<Void> removeFavorite(@AuthenticationPrincipal Jwt jwt, @PathVariable String movieId) {
        String userId = jwt.getSubject();
        favoriteService.removeFavorite(userId, movieId);
        return ApiResponse.<Void>builder().build();
    }

    @GetMapping("/check/{movieId}")
    public ApiResponse<Boolean> checkIsFavorite(@AuthenticationPrincipal Jwt jwt, @PathVariable String movieId) {

        try {
            if (jwt == null) {
                // Người dùng chưa đăng nhập, trả về false
                log.debug("Checking favorite status for anonymous user");
                return ApiResponse.<Boolean>builder().result(false).build();
            }

            String userId = jwt.getSubject();
            boolean isFavorite = favoriteService.checkIsFavorite(userId, movieId);
            return ApiResponse.<Boolean>builder().result(isFavorite).build();
        } catch (Exception e) {
            log.error("Error checking favorite status: {}", e.getMessage());
            return ApiResponse.<Boolean>builder().result(false).build();
        }
    }
}
