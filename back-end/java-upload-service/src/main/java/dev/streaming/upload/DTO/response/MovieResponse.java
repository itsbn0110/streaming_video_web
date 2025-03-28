package dev.streaming.upload.DTO.response;

import java.time.LocalDateTime;
import java.util.Set;
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

    String description;

    int releaseYear;

    String thumbnail;

    double duration;

    String streamUrl;
   
    Set<GenreResponse> genres;

  
    Set<CategoryResponse> categories;

   
    Set<CountryResponse> countries;

    
    Set<PersonResponse> directors;

   
    Set<PersonResponse> actors;

    LocalDateTime createdAt;

}
