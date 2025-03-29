package dev.streaming.upload.controllers;


import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import dev.streaming.upload.DTO.ApiResponse;
import dev.streaming.upload.DTO.request.CountryRequest;
import dev.streaming.upload.DTO.response.CountryResponse;
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

    @PreAuthorize(value = "hasRole('ADMIN')")
    @DeleteMapping
    ApiResponse<Void> delete(@RequestParam String countryName) {
        countryService.delete(countryName);
        return ApiResponse.<Void>builder().build();
    }
}
