package dev.streaming.upload.DTO.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import dev.streaming.upload.enums.MovieType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieResponse {
    String id;

    String title;

    String originalTitle;

    String trailerLink;

    String description;

    int releaseYear;

    String thumbnail;

    String backdrop;

    double duration;

    String streamUrl;

    String ratingCount;

    String averageRating;

    Integer views;

    int status;

    MovieType movieType;

    Boolean premium;

    Set<GenreResponse> genres;

    Set<CategoryResponse> categories;

    Set<CountryResponse> countries;

    Set<PersonSimpleResponse> directors;

    Set<PersonSimpleResponse> actors;

    List<EpisodeResponse> episodes;

    LocalDateTime createdAt;
}
