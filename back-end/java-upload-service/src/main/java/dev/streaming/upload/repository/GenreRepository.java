package dev.streaming.upload.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.streaming.upload.Entity.Genre;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {

    

    void deleteByName(String genreName);

   @Query("SELECT g FROM Genre g WHERE LOWER(g.name) = LOWER(:name)")
    Genre findByNameIgnoreCase(@Param("name") String name);

    /**
     * Find all genres by names (for user stats mapping)
     */
    @Query("SELECT g FROM Genre g WHERE g.name IN :names")
    List<Genre> findByNameIn(@Param("names") List<String> names);
    
    /**
     * Find genre by name with fuzzy matching
     */
    @Query("SELECT g FROM Genre g WHERE LOWER(g.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Genre> findByNameContaining(@Param("name") String name);
    
    /**
     * Get all genre names for AI prompt context
     */
    @Query("SELECT g.name FROM Genre g ORDER BY g.name")
    List<String> findAllGenreNames();
}
