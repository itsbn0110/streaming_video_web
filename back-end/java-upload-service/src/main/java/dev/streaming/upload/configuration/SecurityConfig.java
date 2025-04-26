package dev.streaming.upload.configuration;

import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import dev.streaming.upload.DTO.ApiResponse;
import dev.streaming.upload.enums.Role;
import dev.streaming.upload.exception.ErrorCode;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final String[] PUBLIC_ENDPOINTS_POST = {
        "/users",
        "/auth/login",
        "/auth/introspect",
        "/auth/register",
        "/auth/logout",
        "/auth/refresh",
        "/v1/google-drive/upload",
       
    };

    private final String[] PUBLIC_ENDPOINTS_GET = {
        "/movies/**","/movies","genres/**", "/countries/**", "/categories/**", "/person/**", "/users/**"
    };

    // @Value("${jwt.signerKey}")
    // private String signerKey;

    private final CustomJwtDecoder customJwtDecoder;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.authorizeHttpRequests(request -> request.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS_POST)
                .permitAll()
                .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS_GET)
                .permitAll()
                .requestMatchers(HttpMethod.GET, "/users")
                .hasRole(Role.ADMIN.name())
                .anyRequest()
                .authenticated());

        httpSecurity.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer
                        .decoder(customJwtDecoder)
                        .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint()));

        httpSecurity.exceptionHandling(
                exceptions -> exceptions.accessDeniedHandler((request, response, accessDeniedException) -> {
                    // Log the access denied event
                    Logger logger = LoggerFactory.getLogger("SecurityLogger");
                    logger.error(
                            "Access Denied: " + request.getRequestURI() + " - " + accessDeniedException.getMessage());

                    // Tạo ApiResponse
                    ApiResponse<?> apiResponse = ApiResponse.builder()
                            .code(ErrorCode.UNAUTHORIZED.getCode())
                            .message(ErrorCode.UNAUTHORIZED.getMessage())
                            .build();

                    // Thiết lập response
                    response.setStatus(ErrorCode.UNAUTHORIZED.getStatusCode().value());
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);

                    // Ghi response
                    ObjectMapper objectMapper = new ObjectMapper();
                    objectMapper.writeValue(response.getWriter(), apiResponse);
                }));

        httpSecurity.csrf(AbstractHttpConfigurer::disable);
        return httpSecurity.build();
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        // Cấu hình CORS
        corsConfiguration.setAllowedOriginPatterns(List.of("*"));
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        corsConfiguration.setAllowedHeaders(List.of("*"));
        corsConfiguration.setAllowCredentials(true);

        org.springframework.web.cors.UrlBasedCorsConfigurationSource source =
                new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);

        return source;
    }

    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        return objectMapper;
    }
    // @Bean
    // JwtDecoder jwtDecoder () {
    //     SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS512" );
    //                     return NimbusJwtDecoder
    //                     .withSecretKey(secretKeySpec)
    //                     .macAlgorithm(MacAlgorithm.HS512)
    //                     .build();
    // }

    //  @Bean
    //  PasswordEncoder passwordEncoder () {
    //    return new BCryptPasswordEncoder(8);
    //  }
}
