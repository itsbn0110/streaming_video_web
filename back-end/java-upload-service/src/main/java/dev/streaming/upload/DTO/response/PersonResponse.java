package dev.streaming.upload.DTO.response;

import java.util.Set;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PersonResponse {
    Long id;
    String name;
    String role;
    String birthDate;
    String avatar;
    String biography;
    Set<MovieSimpleResponse> directedMovies;
    Set<MovieSimpleResponse> actedMovies;
}
