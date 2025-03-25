package dev.streaming.upload.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class VideoUtils {
    public static double getVideoDuration(String videoPath) throws IOException {
        ProcessBuilder processBuilder = new ProcessBuilder("ffmpeg", "-i", videoPath);
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        double duration = -1;

        while ((line = reader.readLine()) != null) {
            if (line.contains("Duration:")) {
                String[] parts = line.split(",");
                String durationText = parts[0].split("Duration:")[1].trim();
                duration = parseDuration(durationText);
                break;
            }
        }
        process.destroy();
        return duration;
    }

    private static double parseDuration(String durationText) {
        String[] timeParts = durationText.split(":");
        double hours = Double.parseDouble(timeParts[0]);
        double minutes = Double.parseDouble(timeParts[1]);
        double seconds = Double.parseDouble(timeParts[2]);
        return hours * 3600 + minutes * 60 + seconds;
    }
}
