package dev.streaming.upload.controllers;

<<<<<<< HEAD

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;

import java.io.IOException;

=======
import java.util.List;

import jakarta.validation.Valid;

>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.google.api.services.drive.Drive.Comments.Update;
=======
import org.springframework.web.bind.annotation.RestController;
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52

import dev.streaming.upload.DTO.ApiResponse;
import dev.streaming.upload.DTO.request.UpdateRequest;
import dev.streaming.upload.DTO.request.UserCreationRequest;
import dev.streaming.upload.DTO.response.UserResponse;
<<<<<<< HEAD
import dev.streaming.upload.mapper.UserMapper;
=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
import dev.streaming.upload.services.UserService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/users")
public class UserController {
<<<<<<< HEAD
    UserMapper userMapper;

    @Autowired
    UserService userService;

    @PostMapping("/create")
    public UserResponse createUser(
            @RequestParam("request") String requestJson,
            @RequestPart("avatarFile") MultipartFile avatarFile
        ) throws IOException {

        ObjectMapper mapper = new ObjectMapper()
        .registerModule(new JavaTimeModule());
        
        UserCreationRequest request = mapper.readValue(requestJson, UserCreationRequest.class);
            return userService.createUser(request,avatarFile);
            
    }

    @GetMapping()
    ApiResponse<Page<UserResponse>> getAllUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "15") int size
    ) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        
        
        authentication.getAuthorities().forEach(grantedAuthority -> log.info(grantedAuthority.getAuthority()));
        

        return ApiResponse.<Page<UserResponse>>builder()
                .result( userService.getAllUsers(page, size))
                .build();
    }

=======
    @Autowired
    UserService userService;

    @PostMapping
    public UserResponse createUser(@RequestBody @Valid UserCreationRequest request) {
        return userService.createUser(request);
    }

    @GetMapping
    ApiResponse<List<UserResponse>> getAllUsers() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("Username: {}", authentication.getName());
        authentication.getAuthorities().forEach(grantedAuthority -> log.info(grantedAuthority.getAuthority()));
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getAllUsers())
                .build();
    }


>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
    @GetMapping("/{userId}")
    UserResponse getUserById(@PathVariable String userId) {
        return userService.getUserById(userId);
    }

    @GetMapping("/myInfo")
    ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    @PutMapping("/{userId}")
<<<<<<< HEAD
    UserResponse updateUser(
        @RequestParam (value = "request", required = false) String requestJson,
        @RequestPart(value = "avatarFile", required = false) MultipartFile avatarFile,
        @PathVariable String userId
        
    ) throws JsonMappingException, JsonProcessingException {
        
        ObjectMapper mapper = new ObjectMapper()
        .registerModule(new JavaTimeModule());
        
        UpdateRequest request = mapper.readValue(requestJson, UpdateRequest.class);
        return userService.updateUser(request,avatarFile, userId);
    }

    @PreAuthorize(value = "hasRole('ADMIN')")
    @DeleteMapping("/delete/{userId}")
=======
    UserResponse updateUser(@RequestBody UpdateRequest request, @PathVariable String userId) {
        return userService.updateUser(request, userId);
    }

    @PreAuthorize(value = "hasRole('ADMIN')")
    @DeleteMapping("/{userId}")
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
    String deteleUserByEmail(@PathVariable String userId) {
        userService.deleteUser(userId);
        return "delete successfully!";
    }
}
