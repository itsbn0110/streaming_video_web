package dev.streaming.upload.Entity;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

<<<<<<< HEAD
import com.fasterxml.jackson.annotation.JsonFormat;

=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String username;

    String password;

<<<<<<< HEAD
    String avatar;

=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
    String email;

    String fullName;

    LocalDate dob;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    List<Comment> comments;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    List<Rating> ratings;

    @ManyToMany
    Set<Role> roles;
}
