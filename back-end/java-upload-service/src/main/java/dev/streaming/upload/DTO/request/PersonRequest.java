package dev.streaming.upload.DTO.request;

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
public class PersonRequest {
<<<<<<< HEAD
    String name;
    String role;
    String birthDate;
    String biography;
    String avatar;
=======
    String personName;
    String personRole;
    String personBirthDate;
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
}
