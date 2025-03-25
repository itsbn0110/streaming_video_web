package dev.streaming.upload.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.streaming.upload.Entity.Country;

@Repository
public interface CountryRepository extends JpaRepository<Country, Long> {

    List<Country> findByNameIn(List<String> countries);
    void deleteByName (String countryName);

}
