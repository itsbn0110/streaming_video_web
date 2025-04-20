package dev.streaming.upload.DTO.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonFormat;

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
    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate dob;

    String fullName;

    String avatar;

    String role;
}
