package dev.streaming.upload.DTO.request;

import java.time.LocalDate;

<<<<<<< HEAD
import com.fasterxml.jackson.annotation.JsonFormat;

=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import dev.streaming.upload.validator.DobConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCreationRequest {
    @Size(min = 8, message = "INVALID_USERNAME")
    String username;

    @NotBlank(message = "you forgot type your email!")
    @Email(message = "INVALID_EMAIL")
    String email;

    @Size(min = 3, message = "INVALID_PASSWORD")
    String password;

    @DobConstraint(min = 16, message = "INVALID_DOB")
<<<<<<< HEAD
    @JsonFormat(pattern = "yyyy-MM-dd")
=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
    LocalDate dob;

    String fullName;

    String avatar;
<<<<<<< HEAD

    String role;
=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
}
