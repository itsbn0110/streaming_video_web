package dev.streaming.upload.Entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "user_genre_stats", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "genre_id"})
})
public class UserGenreStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "user_id", nullable = false)
    String userId;

    @Column(name = "genre_id", nullable = false)
    Long genreId;

    @Column(name = "total_views", nullable = false, columnDefinition = "INT DEFAULT 0")
    Integer totalViews;

    @Column(name = "movie_views", nullable = false)
    private int movieViews;

    @Column(name = "last_updated", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    LocalDateTime lastUpdated;
}
