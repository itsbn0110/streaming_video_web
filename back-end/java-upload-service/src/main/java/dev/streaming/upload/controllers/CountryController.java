package dev.streaming.upload.controllers;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.streaming.upload.DTO.ApiResponse;
import dev.streaming.upload.DTO.request.CountryRequest;
import dev.streaming.upload.DTO.response.CountryResponse;
import dev.streaming.upload.Entity.Country;
import dev.streaming.upload.exception.AppException;
import dev.streaming.upload.exception.ErrorCode;
import dev.streaming.upload.services.CountryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/countries")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CountryController {

    CountryService countryService;

    @PreAuthorize(value = "hasRole('ADMIN')")
    @PostMapping
    ApiResponse<CountryResponse> create(@RequestBody CountryRequest request) {
        return ApiResponse.<CountryResponse>builder()
                .result(countryService.create(request.getCountryName()))
                .message("Created country successfully!")
                .build();
    }

    @GetMapping
    ApiResponse<List<Country>> getAllCountries() {
        return ApiResponse.<List<Country>>builder()
                .result(countryService.getAll())
                .build();
    }

    @GetMapping("/{countryId}")
    ApiResponse<CountryResponse> getCountry(@PathVariable Long countryId) {
        return ApiResponse.<CountryResponse>builder()
        .result(countryService.getCountry(countryId))
        .build();
    }

    @PutMapping("/{countryId}")
    ApiResponse<CountryResponse> update(@PathVariable Long countryId, @RequestBody CountryRequest request) {
        return ApiResponse.<CountryResponse>builder()
                .result(countryService.update(countryId, request.getCountryName()))
                .message("Updated country successfully!")
                .build();
    }

    @PreAuthorize(value = "hasRole('ADMIN')")
    @DeleteMapping("{countryId}")
    ApiResponse<Void> delete(@PathVariable Long countryId) {
        try {
            countryService.delete(countryId);
        } catch (Exception e) {
            throw new AppException(ErrorCode.DELETE_FAILED);
        }
        return ApiResponse.<Void>builder().message("deleted successfully").build();
    }
}
