package dev.streaming.upload.Entity;

import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.*;

import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyMovieViewsId implements Serializable {

    @Column(name = "movie_id", nullable = false)
    private String movieId;

    @Column(name = "view_date", nullable = false)
    private LocalDate viewDate;
}
