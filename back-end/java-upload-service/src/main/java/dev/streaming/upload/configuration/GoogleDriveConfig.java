package dev.streaming.upload.configuration;

import java.io.FileInputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class GoogleDriveConfig {
    
    private final ResourceLoader resourceLoader;
    
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String APPLICATION_NAME = "StreamingServiceApp";
    
    @Value("${google.service-account.key-file}")
    private String serviceAccountKeyPath;

    @Bean
    public Drive getDrive() {
        try {
            HttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
            GoogleCredentials credentials = getServiceAccountCredentials();
            
            return new Drive.Builder(
                    httpTransport,
                    JSON_FACTORY,
                    new HttpCredentialsAdapter(credentials))
                    .setApplicationName(APPLICATION_NAME)
                    .build();
        } catch (GeneralSecurityException | IOException e) {
            log.error("create drive : {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create drive: ", e);
        }
    }
    
    private GoogleCredentials getServiceAccountCredentials() throws IOException {
        try {
            Resource resource = resourceLoader.getResource(serviceAccountKeyPath);
            GoogleCredentials credentials = ServiceAccountCredentials.fromStream(resource.getInputStream())
                    .createScoped(Collections.singleton(DriveScopes.DRIVE));
            
            return credentials;
        } catch (IOException e) {
            log.error("Eror loading: {}", e.getMessage(), e);
            throw new IOException("credentials error: ", e);
        }
    }
}