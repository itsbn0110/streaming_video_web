package dev.streaming.upload.DTO.response;

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
<<<<<<< HEAD
    Long id;
    String name;
    String role;
    String birthDate;
    String avatar;
    String biography;
=======
    String name;
    String roles;
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
}