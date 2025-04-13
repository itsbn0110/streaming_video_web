package dev.streaming.upload.controllers;


import java.io.IOException;
<<<<<<< HEAD
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
=======
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.streaming.upload.DTO.ApiResponse;

import dev.streaming.upload.DTO.request.PersonRequest;
import dev.streaming.upload.DTO.response.PersonResponse;
<<<<<<< HEAD
import dev.streaming.upload.mapper.PersonMapper;
=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
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

<<<<<<< HEAD
    PersonMapper personMapper;
=======
    
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
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


<<<<<<< HEAD
    @GetMapping("/actors")
    ApiResponse<List<PersonResponse>> getAllActors() {
        return ApiResponse.<List<PersonResponse>>builder()
        .result(personService.getAllActors("Actor").stream().map(actor -> personMapper.toPersonResponse(actor)).collect(Collectors.toList()))
        .build();
    }

    @GetMapping("/directors")
    ApiResponse<List<PersonResponse>> getAllDirectors () {
        return ApiResponse.<List<PersonResponse>>builder()
        .result(personService.getAllDirectors("Director").stream().map(director -> personMapper.toPersonResponse(director)).collect(Collectors.toList()))
        .build();
    }



    @PutMapping("/{personId}")
    ApiResponse<PersonResponse> updatePerson(
                                @RequestParam("request") String requestJson,
                                @RequestPart(value ="personAvatar", required =false) MultipartFile personAvatar,
                                @PathVariable("personId") Long personId
        ) throws IOException {

         // Chuyển đổi JSON string thành MovieUploadRequest object
        ObjectMapper mapper = new ObjectMapper();
        PersonRequest request = mapper.readValue(requestJson, PersonRequest.class);

        return ApiResponse.<PersonResponse>builder()
                .result(personService.updatePerson(request,personAvatar,personId))
                .message("Updated successfully!")
                .build();
    }
    

=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
    @PreAuthorize(value = "hasRole('ADMIN')")
    @DeleteMapping("/{personId}")
    ApiResponse<Void> delete(@PathVariable Long personId) {
        personService.delete(personId);
        return ApiResponse.<Void>builder().build();
    }
}
