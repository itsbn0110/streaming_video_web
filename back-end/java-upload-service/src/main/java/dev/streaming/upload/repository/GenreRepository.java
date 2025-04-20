package dev.streaming.upload.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.streaming.upload.Entity.Genre;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {

    List<Genre> findByNameIn(List<String> genres);

    void deleteByName(String genreName);
}
