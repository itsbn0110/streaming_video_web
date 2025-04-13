package dev.streaming.upload.Entity;

<<<<<<< HEAD
=======
import java.time.LocalDate;
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
<<<<<<< HEAD
=======
import jakarta.persistence.Lob;
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "persons")
public class Person {

    @Id
<<<<<<< HEAD
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name;

    String birthDate;

    String biography;

    String avatar;

    String role;
=======
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String name;

    LocalDate birthDate;

    @Lob
    byte[] avatar;

    String roles;
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52

    @ManyToMany(mappedBy = "directors")
    @JsonIgnore
    List<Movie> directedMovies;

    @ManyToMany(mappedBy = "actors")
    @JsonIgnore
    List<Movie> actedMovies;
}
