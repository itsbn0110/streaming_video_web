package dev.streaming.upload.services;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Collections;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.api.client.http.InputStreamContent;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;

import dev.streaming.upload.Entity.Movie;
import dev.streaming.upload.configuration.GoogleDriveConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleDriveManager {
    private final GoogleDriveConfig googleDriveConfig;

    public String findFolderById(String parentId, String folderName) {
        String folderId = null;
        String pageToken = null;

        do {
            String query = " mimeType = 'application/vnd.google-apps.folder' ";

            query = parentId == null ? query + " and 'root' in parents" : query + " and '" + parentId + "' in parents";

            try {
                FileList result = googleDriveConfig
                        .getDrive()
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
                throw new RuntimeException(e);
            }

        } while (pageToken != null && folderName == null);

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
            return googleDriveConfig
                    .getDrive()
                    .files()
                    .create(folder)
                    .setFields("id")
                    .execute()
                    .getId();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }



    public String getFolderId(String movieName) {
        String parentFolderId = findOrCreateFolder(null, "ALL-Movie"); // Tạo thư mục ALL Movie
        return findOrCreateFolder(parentFolderId, movieName); // Tạo thư mục con theo tên phim
    }


    public void deleteFileOrFolderById(String id) {
        try {
            googleDriveConfig.getDrive().files().delete(id).execute();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public Movie uploadMovie(MultipartFile thumbnailFile, MultipartFile movieFile, String folderName, String movieName, Movie movie) {

        log.info("chay vao day roi movie : {}", movie);
        if (thumbnailFile.getContentType() == null || !thumbnailFile.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Avatar file must be an image");
        }

        if (movieFile.getContentType() == null || !movieFile.getContentType().startsWith("video/")) {
            throw new IllegalArgumentException("Movie file must be a video");
        }

        // Tạo hoặc tìm thư mục của phim trong "ALL Movie"

        String folderId = getFolderId(movieName);

        log.info("folderId : {}", folderId);

        try {
            File videoMetadata = new File();
            videoMetadata.setParents(Collections.singletonList(folderId));
            videoMetadata.setName(movieName + ".mp4");

            File uploadedMovie = googleDriveConfig
                    .getDrive()
                    .files()
                    .create(
                            videoMetadata,
                            new InputStreamContent(
                                    movieFile.getContentType(), new ByteArrayInputStream(movieFile.getBytes())))
                    .setFields("id, name, webViewLink")
                    .execute();
            log.info("uploadedMovie: {}", uploadedMovie);

            // 🟢 Upload thumbnail
            File thumbnailMetadata = new File();
            thumbnailMetadata.setParents(Collections.singletonList(folderId));
            thumbnailMetadata.setName(movieName + "_thumbnail.jpg");

            File uploadedThumbnail = googleDriveConfig
                    .getDrive()
                    .files()
                    .create(
                            thumbnailMetadata,
                            new InputStreamContent(
                                    thumbnailFile.getContentType(), new ByteArrayInputStream(thumbnailFile.getBytes())))
                    .setFields("id, webViewLink")
                    .execute();

            log.info("uploadedThumbnail: {}", uploadedThumbnail);

            String videoId = uploadedMovie.getId();

            String streamUrl = uploadedMovie.getWebViewLink();

            String thumbnail = uploadedThumbnail.getWebViewLink();
            movie.setFolderId(folderId);
            movie.setThumbnail(thumbnail);
            movie.setVideoId(videoId);
            movie.setStreamUrl(streamUrl);
            log.info("movie sau khi update: {}", movie);
 
            return movie;
        } catch (IOException e) {
            throw new RuntimeException("Upload failed: " + e.getMessage(), e);
        }
    }
}
