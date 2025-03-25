package dev.streaming.upload.services;

import java.util.List;
import org.springframework.stereotype.Service;
import dev.streaming.upload.DTO.response.CountryResponse;
import dev.streaming.upload.Entity.Country;
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

      public List<Country> getAll() {
        List<Country> countries = countryRepository.findAll();
        return countries;
    }

    public void delete(String countryName) {
        countryRepository.deleteByName(countryName);
    }


}
