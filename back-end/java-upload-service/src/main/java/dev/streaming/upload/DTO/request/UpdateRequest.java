package dev.streaming.upload.DTO.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
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
public class UpdateRequest {
    @Email(message = "INVALID_EMAIL")
    String email;

    @Size(min = 3, message = "INVALID_PASSWORD")
    String password;

    @DobConstraint(min = 16, message = "INVALID_DOB")
    LocalDate dob;

    String fullName;

    String avatar;

    String role;
}
