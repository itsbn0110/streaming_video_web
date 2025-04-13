package dev.streaming.upload.DTO.response;

import java.time.LocalDate;
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
public class UserResponse {
    String id;
    String username;
<<<<<<< HEAD
    String fullName;
    String email;
    String avatar;
=======
    String email;
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
    LocalDate dob;
    Set<RoleResponse> roles;
}
