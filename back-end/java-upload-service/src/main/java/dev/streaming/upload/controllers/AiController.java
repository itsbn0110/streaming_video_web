package dev.streaming.upload.controllers;

import dev.streaming.upload.services.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private OpenAiService openAiService;

    @PostMapping("/generate-movie-suggestions")
    public ResponseEntity<String> generateMovieSuggestions(@RequestBody Map<String, Object> request) {
        String prompt = (String) request.get("prompt");
        String response = openAiService.generateResponse(prompt);
        return ResponseEntity.ok(response);
    }
}
