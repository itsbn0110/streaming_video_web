package dev.streaming.upload.services;

import java.io.IOException;
import java.util.Collections;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.api.client.http.InputStreamContent;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.google.api.services.drive.model.Permission;

import dev.streaming.upload.Entity.Movie;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleDriveManager {
    
    private final Drive driveService;

    public void setPublicPermission(String fileId) throws IOException {
        Permission permission = new Permission();
        permission.setType("anyone");
        permission.setRole("reader");

        driveService.permissions().create(fileId, permission).setFields("id").execute();
    }

    public String findFolderById(String parentId, String folderName) {
        String folderId = null;
        String pageToken = null;

        do {
            String query = " mimeType = 'application/vnd.google-apps.folder' ";

            query = parentId == null ? query + " and 'root' in parents" : query + " and '" + parentId + "' in parents";

            try {
                FileList result = driveService
                        .files()
                        .list()
                        .setQ(query)
                        .setSpaces("drive")
                        .setFields("nextPageToken, files(id, name)")
                        .setPageToken(pageToken)
                        .execute();
                for (File file : result.getFiles()) {
                    if (file.getName().equalsIgnoreCase(folderName)) {
                        folderId = file.getId();
                    }
                }
                pageToken = result.getNextPageToken();
            } catch (IOException e) {
                log.error("Error finding folder: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to find folder", e);
            }

        } while (pageToken != null && folderId == null);

        return folderId;
    }

    public String findOrCreateFolder(String parentId, String folderName) {
        String folderId = findFolderById(parentId, folderName);

        if (folderId != null) {
            return folderId;
        }

        File folder = new File();
        folder.setMimeType("application/vnd.google-apps.folder");
        folder.setName(folderName);

        if (parentId != null) {
            folder.setParents(Collections.singletonList(parentId));
        }

        try {
            return driveService
                    .files()
                    .create(folder)
                    .setFields("id")
                    .execute()
                    .getId();
        } catch (IOException e) {
            log.error("Error creating folder: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create folder", e);
        }
    }

    public String getFolderId(String movieName) {
        String parentFolderId = findOrCreateFolder("1VVBoGCJHJ6MUi5Mujz5cVfN3i2DkJ6dW", "ALL-Movie"); // Create ALL-Movie folder
        return findOrCreateFolder(parentFolderId, movieName); // Create subfolder with movie name
    }

    public void deleteFileOrFolderById(String id) {
        try {
            driveService.files().delete(id).execute();
            log.info("Successfully deleted file/folder with ID: {}", id);
        } catch (IOException e) {
            log.error("Error deleting file/folder: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete file or folder", e);
        }
    }

    public Movie uploadMovie(MultipartFile movieFile, String movieName, Movie movie) {
        if (movieFile.getContentType() == null || !movieFile.getContentType().startsWith("video/")) {
            throw new IllegalArgumentException("Movie file must be a video");
        }

        // Create or find movie folder in "ALL Movie"
        String folderId = getFolderId(movieName);
        log.info("Uploading movie to folder with ID: {}", folderId);

        try {
            File videoMetadata = new File();
            videoMetadata.setParents(Collections.singletonList(folderId));
            videoMetadata.setName(movieName + ".mp4");

            File uploadedMovie = driveService
                    .files()
                    .create(
                            videoMetadata,
                            new InputStreamContent(movieFile.getContentType(), movieFile.getInputStream()))
                    .setFields("id, name, webViewLink")
                    .execute();

            String videoId = uploadedMovie.getId();
            String streamUrl = uploadedMovie.getWebViewLink();

            setPublicPermission(uploadedMovie.getId());
            
            movie.setFolderId(folderId);
            movie.setVideoId(videoId);
            movie.setStreamUrl(streamUrl);

            log.info("Successfully uploaded movie: {}, videoId: {}", movieName, videoId);
            return movie;
        } catch (IOException e) {
            log.error("Upload failed: {}", e.getMessage(), e);
            throw new RuntimeException("Upload failed: " + e.getMessage(), e);
        }
    }
}