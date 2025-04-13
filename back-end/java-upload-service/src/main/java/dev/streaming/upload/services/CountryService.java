package dev.streaming.upload.services;

import java.util.List;
import org.springframework.stereotype.Service;
import dev.streaming.upload.DTO.response.CountryResponse;
import dev.streaming.upload.Entity.Country;
<<<<<<< HEAD

import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.exception.AppException;
import dev.streaming.upload.exception.ErrorCode;
=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
import dev.streaming.upload.mapper.CountryMapper;
import dev.streaming.upload.repository.CountryRepository;
import dev.streaming.upload.utils.SlugUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CountryService {

    CountryRepository countryRepository;
    CountryMapper countryMapper;
    public CountryResponse create( String countryName ) {
        String slug = SlugUtils.toSlug(countryName);
        Country country= countryRepository.save(Country.builder().name(countryName).slug(slug).build());

        CountryResponse countryResponse = countryMapper.toCountryResponse(country);
        return countryResponse;
    }

<<<<<<< HEAD
      
    public List<Country> getAll() {
=======
      public List<Country> getAll() {
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
        List<Country> countries = countryRepository.findAll();
        return countries;
    }

<<<<<<< HEAD

    public CountryResponse update( Long countryId , String countryName) {
        String slug = SlugUtils.toSlug(countryName);
        var country = countryRepository.findById(countryId).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));


        country.setSlug(slug);
        country.setName(countryName);
        
        countryRepository.save(country);

        CountryResponse countryResponse = countryMapper.toCountryResponse(country);
        return countryResponse;
    }

    public void delete(Long countryId) {
       Country country = countryRepository.findById(countryId)
                    .orElseThrow(() -> new RuntimeException("Country not found"));

        for (Movie movie : country.getMovies()) {
            movie.getCountries().remove(country); 
        }

    
        country.getMovies().clear();

    
        countryRepository.delete(country);
=======
    public void delete(String countryName) {
        countryRepository.deleteByName(countryName);
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
    }


}
