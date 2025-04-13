package dev.streaming.upload.DTO.request;

import java.time.LocalDate;
<<<<<<< HEAD


import dev.streaming.upload.validator.DobConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
=======
import java.util.List;

import dev.streaming.upload.validator.DobConstraint;
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateRequest {
<<<<<<< HEAD
    @Email(message = "INVALID_EMAIL")
    String email;

    @Size(min = 3, message = "INVALID_PASSWORD")
    String password;

    @DobConstraint(min = 16, message = "INVALID_DOB")
    LocalDate dob;

    String fullName;

    String avatar;

    String role;
=======
    String username;
    String email;
    String password;

    @DobConstraint(min = 18, message = "INVALID_DOB")
    LocalDate dob;

    List<String> roles;
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
}
