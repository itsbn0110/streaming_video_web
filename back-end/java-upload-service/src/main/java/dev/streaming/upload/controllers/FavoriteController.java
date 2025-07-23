package dev.streaming.upload.controllers;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nimbusds.jwt.JWTClaimsSet;

import dev.streaming.upload.DTO.ApiResponse;
import dev.streaming.upload.DTO.request.FavoriteRequest;
import dev.streaming.upload.DTO.response.FavoriteResponse;
import dev.streaming.upload.exception.AppException;
import dev.streaming.upload.exception.ErrorCode;
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

    FavoriteService favoriteService;

    private String getUserId(JWTClaimsSet principal) {
        if (principal == null) {
            log.error("JWT principal is null");
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        String userId = principal.getSubject();
        if (userId == null || userId.isEmpty()) {
            log.error("User ID from JWT is null or empty");
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return userId;
    }

    @GetMapping
    public ApiResponse<List<FavoriteResponse>> getUserFavorites(
            @AuthenticationPrincipal JWTClaimsSet principal) {
        String userId = getUserId(principal);
        List<FavoriteResponse> favorites = favoriteService.getUserFavorites(userId);
        return ApiResponse.<List<FavoriteResponse>>builder()
                .result(favorites)
                .build();
    }

    @PostMapping
    public ApiResponse<FavoriteResponse> addFavorite(
            @AuthenticationPrincipal JWTClaimsSet principal,
            @RequestBody FavoriteRequest request) {
        String userId = getUserId(principal);
        FavoriteResponse favorite = favoriteService.addFavorite(userId, request);
        return ApiResponse.<FavoriteResponse>builder()
                .result(favorite)
                .build();
    }

    @DeleteMapping("/{movieId}")
    public ApiResponse<Void> removeFavorite(
            @AuthenticationPrincipal JWTClaimsSet principal,
            @PathVariable String movieId) {
        String userId = getUserId(principal);
        favoriteService.removeFavorite(userId, movieId);
        return ApiResponse.<Void>builder().build();
    }

    @GetMapping("/check/{movieId}")
    public ApiResponse<Boolean> checkIsFavorite(
            @AuthenticationPrincipal JWTClaimsSet principal,
            @PathVariable String movieId) {

        try {
            if (principal == null) {
                // Người dùng chưa đăng nhập, trả về false
                log.debug("Checking favorite status for anonymous user");
                return ApiResponse.<Boolean>builder()
                        .result(false)
                        .build();
            }

            String userId = getUserId(principal);
            boolean isFavorite = favoriteService.checkIsFavorite(userId, movieId);
            return ApiResponse.<Boolean>builder()
                    .result(isFavorite)
                    .build();
        } catch (Exception e) {
            log.error("Error checking favorite status: {}", e.getMessage());
            return ApiResponse.<Boolean>builder()
                    .result(false)
                    .build();
        }
    }
}

