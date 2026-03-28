package com.furever.webapplication.FurEver;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class WelcomeController {

    @GetMapping("/")
    public ResponseEntity<?> welcome() {
        return ResponseEntity.ok(Map.of(
            "message", "FurEver Backend is running!",
            "status", "healthy",
            "version", "0.0.1-SNAPSHOT",
            "api_docs", "https://furever-backend-bn81.onrender.com/api/pets"
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
