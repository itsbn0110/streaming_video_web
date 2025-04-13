package dev.streaming.upload.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

<<<<<<< HEAD

=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
import dev.streaming.upload.Entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByusername(String username);

    Optional<User> findByusername(String username);
<<<<<<< HEAD

   
=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
}
