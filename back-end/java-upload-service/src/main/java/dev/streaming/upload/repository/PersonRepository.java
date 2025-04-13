package dev.streaming.upload.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.streaming.upload.Entity.Person;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {

    List<Person> findByNameIn(List<String> personNames);
<<<<<<< HEAD
    List<Person> findByRole(String role);
=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52

}
