package dev.streaming.upload.DTO.response;

import java.time.LocalDateTime;

import com.google.auto.value.AutoValue.Builder;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EpisodeResponse {
    private String id;
    private String title;
    private String description;
    private Integer episodeNumber;
    private int status;
    private Double duration;
    private String streamUrl;
    private String videoId;
    private String folderId;
    private String movieTitle;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
