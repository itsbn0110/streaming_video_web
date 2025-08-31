package dev.streaming.upload.DTO.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlaylistResponse {
    private Long id;
    private String name;
    private String description;
    private UserResponse user;
    private List<MovieResponse> movies;
    private Integer movieCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
