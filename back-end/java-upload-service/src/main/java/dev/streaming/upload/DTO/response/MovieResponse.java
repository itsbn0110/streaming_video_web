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
<<<<<<< HEAD
=======

>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
public class MovieResponse {
    String id;

    String title;

<<<<<<< HEAD
    String originalTitle;

    String trailerLink;

=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
    String description;

    int releaseYear;

    String thumbnail;
<<<<<<< HEAD
    
    String backdrop;
=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52

    double duration;

    String streamUrl;
<<<<<<< HEAD

    String status;

    Boolean premium;
=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
   
    Set<GenreResponse> genres;

  
    Set<CategoryResponse> categories;

   
    Set<CountryResponse> countries;

    
    Set<PersonResponse> directors;

   
    Set<PersonResponse> actors;

    LocalDateTime createdAt;

}
