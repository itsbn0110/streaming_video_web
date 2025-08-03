package dev.streaming.upload.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_USER(9999, "UNCATEGORIZED", HttpStatus.INTERNAL_SERVER_ERROR),
    UNCATEGORIZED_EXCEPTION(9999, "An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_ALREADY_EXIST(1001, "User is already existed!", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(1002, "This is Invalid Email!!!!", HttpStatus.BAD_REQUEST),
    INVALID_USERNAME(1003, "This is Invalid UserName!!!!", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "This is Invalid password!!!!", HttpStatus.BAD_REQUEST),
    INVALID_KEY(1005, "INVALID_KEY, CHECK SOMEWHERE!", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1006, "This user is not existed!!", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1007, "Unauthenticated error : Authentication is required to acceess this resource!", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1008, "Do not have this permission!", HttpStatus.FORBIDDEN),
    INVALID_DOB(1009, "Your age must be at least {min}!", HttpStatus.FORBIDDEN),
    MISSING_FILE(1010, "Missing field: ", HttpStatus.BAD_REQUEST),
    MOVIE_NOT_FOUND(1011, "Movie not found {movieId}: ", HttpStatus.NOT_FOUND),
    MOVIE_NOT_EXISTED(1011, "Movie not found", HttpStatus.NOT_FOUND), // Alias for MOVIE_NOT_FOUND,
    UPLOAD_FAILED(1012, "Error while uploading movie", HttpStatus.BAD_REQUEST),
    FILE_OR_FOLDER_NOT_EXSIST(1013, "Can not find you file or folder", HttpStatus.NOT_FOUND),
    PERSON_NOT_EXISTED(1014, "This person is not existed!", HttpStatus.NOT_FOUND),
    DELETE_FAILED(1015, "Cannot delete this field", HttpStatus.BAD_REQUEST),
    NOT_FOUND(1016, "Cannot find this Entity!", HttpStatus.NOT_FOUND),
    PASSWORD_OR_USERNAME_FAILED(1017, "Password or Username failed", HttpStatus.UNAUTHORIZED),
    MOVIE_ALREADY_IN_FAVORITES(1018, "Movie is already in your favorites!", HttpStatus.BAD_REQUEST),
    FAVORITE_NOT_FOUND(1019, "Favorite not found ", HttpStatus.NOT_FOUND),
    INVALID_RATING_VALUE(1020, "Invalid rating value", HttpStatus.BAD_REQUEST),
    RATING_NOT_FOUND(1021, "Rating not found ", HttpStatus.NOT_FOUND),
    RATING_ALREADY_EXISTED(1022, "Rating already existed!", HttpStatus.BAD_REQUEST),

    // Playlist error codes
    PLAYLIST_NOT_FOUND(1023, "Playlist not found", HttpStatus.NOT_FOUND),
    PLAYLIST_NOT_EXISTED(1023, "Playlist not found", HttpStatus.NOT_FOUND), // Alias for PLAYLIST_NOT_FOUND
    MOVIE_NOT_IN_PLAYLIST(1024, "Movie is not in the playlist", HttpStatus.BAD_REQUEST),
    MOVIE_ALREADY_IN_PLAYLIST(1025, "Movie is already in the playlist", HttpStatus.BAD_REQUEST),
    CONCURRENT_MODIFICATION(1026, "Concurrent modification", HttpStatus.CONFLICT),
    PLAYLIST_ALREADY_EXISTED(1027, "Playlist with this name already exists", HttpStatus.BAD_REQUEST),
    DATABASE_ERROR( 1028, "Database error", HttpStatus.INTERNAL_SERVER_ERROR);

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
