package dev.streaming.upload.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.streaming.upload.Entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByusername(String username);

    Optional<User> findByusername(String username);

   
}
