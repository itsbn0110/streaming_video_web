package dev.streaming.upload.DTO.request;

import java.util.List;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieUploadRequest {
    @NotBlank(message = "NOT_BLANK_TITLE")
    String title;

<<<<<<< HEAD
    String originalTitle;

    String trailerLink;

    // String thumbnailPreview;

    int releaseYear;
    
    String status;

    Boolean premium;

=======
    int releaseYear;
    
    
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52
    @Size(max = 500, message = "NOT_BLANK_DESCRIPTION")
    String description;

    List<String> categories;

    List<String> genres;

    List<String> countries;

    List<String> actors;

    List<String> directors;

<<<<<<< HEAD
=======
    String folderName;
>>>>>>> bc2372312a5c8b78049ba06d9e36853f03138c52


    double duration;
}
