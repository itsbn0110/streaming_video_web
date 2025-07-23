package dev.streaming.upload.DTO.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteResponse {
    private Long id;
    private MovieResponse movie;
    private LocalDateTime createdAt;
}
