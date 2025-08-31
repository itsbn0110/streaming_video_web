package dev.streaming.upload.services;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CloudinaryService {
    Cloudinary cloudinary;

    @SuppressWarnings("unchecked")
    public String uploadImage(MultipartFile file, int width, int height) throws IOException {
        Map<String, Object> uploadResult = cloudinary
                .uploader()
                .upload(
                        file.getBytes(),
                        ObjectUtils.asMap(
                                "transformation",
                                new Transformation().width(width).height(height).crop("fill")));
        return uploadResult.get("secure_url").toString();
    }
}
