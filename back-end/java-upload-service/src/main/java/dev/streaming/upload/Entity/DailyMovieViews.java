package dev.streaming.upload.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
        name = "daily_movie_views",
        indexes = {
            @Index(name = "idx_movie_id", columnList = "movie_id"),
            @Index(name = "idx_view_date", columnList = "view_date")
        })
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DailyMovieViews {
    @EmbeddedId
    private DailyMovieViewsId id;

    @Column(name = "view_count", nullable = false)
    private Long viewCount;

    @MapsId("movieId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;
}
