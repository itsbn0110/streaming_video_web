package dev.streaming.upload.mapper;

import org.mapstruct.Mapper;

import dev.streaming.upload.DTO.response.CountryResponse;
import dev.streaming.upload.Entity.Country;

@Mapper(componentModel = "spring")
public interface CountryMapper {
    CountryResponse toCountryResponse(Country country);
}
