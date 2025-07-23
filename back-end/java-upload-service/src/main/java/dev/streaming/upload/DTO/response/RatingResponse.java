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
public class RatingResponse {
    private Long id;
    private Integer starValue;
    private UserResponse user;
    private LocalDateTime createdAt;
}
