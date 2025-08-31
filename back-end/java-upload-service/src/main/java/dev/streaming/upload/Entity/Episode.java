package dev.streaming.upload.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Episode {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;
    private String description;
    private Integer episodeNumber;
    private Double duration;
    private String streamUrl;
    private String videoId;
    private String folderId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int status;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @Column(name = "movie_id", insertable = false, updatable = false)
    private String movieId;
}
