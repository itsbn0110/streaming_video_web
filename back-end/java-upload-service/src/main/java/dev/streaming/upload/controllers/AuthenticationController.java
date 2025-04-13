package dev.streaming.upload.controllers;

import java.text.ParseException;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nimbusds.jose.JOSEException;

import dev.streaming.upload.DTO.ApiResponse;
import dev.streaming.upload.DTO.request.AuthenticationRequest;
import dev.streaming.upload.DTO.request.IntrospectRequest;
import dev.streaming.upload.DTO.request.LogoutRequest;
import dev.streaming.upload.DTO.request.RefreshRequest;
import dev.streaming.upload.DTO.response.AuthenticationResponse;
import dev.streaming.upload.DTO.response.IntrospectResponse;
import dev.streaming.upload.services.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;

<<<<<<< HEAD
    @PostMapping("/login")
=======
    @PostMapping("login")
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

<<<<<<< HEAD
    @PostMapping("/register")
    ApiResponse<AuthenticationResponse> register(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.register(request);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

=======
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder().result(result).build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder().build();
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> refreshToken(@RequestBody RefreshRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }
}
