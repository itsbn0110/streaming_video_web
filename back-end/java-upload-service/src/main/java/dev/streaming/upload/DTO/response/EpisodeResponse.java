package dev.streaming.upload.DTO.response;

import java.time.LocalDateTime;
import com.google.auto.value.AutoValue.Builder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EpisodeResponse {
    private String title; 
    private String description; 
    private Integer episodeNumber; 
    private Double duration;
    private String streamUrl; 
    private String videoId; 
    private String folderId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}