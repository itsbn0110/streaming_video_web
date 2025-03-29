package dev.streaming.upload.controllers;


import java.io.IOException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.streaming.upload.DTO.ApiResponse;

import dev.streaming.upload.DTO.request.PersonRequest;
import dev.streaming.upload.DTO.response.PersonResponse;
import dev.streaming.upload.services.PersonService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/person")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PersonController {
    
    PersonService personService;

    
    @PreAuthorize(value = "hasRole('ADMIN')")
    @PostMapping
    ApiResponse<PersonResponse> create(
                                @RequestParam("request") String requestJson,
                                @RequestPart("personAvatar") MultipartFile personAvatar
        ) throws IOException {

         // Chuyển đổi JSON string thành MovieUploadRequest object
        ObjectMapper mapper = new ObjectMapper();
        PersonRequest request = mapper.readValue(requestJson, PersonRequest.class);

        return ApiResponse.<PersonResponse>builder()
                .result(personService.create(request,personAvatar))
                .message("Created successfully!")
                .build();
    }


    @PreAuthorize(value = "hasRole('ADMIN')")
    @DeleteMapping("/{personId}")
    ApiResponse<Void> delete(@PathVariable Long personId) {
        personService.delete(personId);
        return ApiResponse.<Void>builder().build();
    }
}
