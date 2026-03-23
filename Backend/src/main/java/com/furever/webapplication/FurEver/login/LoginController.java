package com.furever.webapplication.FurEver.login;

import com.furever.webapplication.FurEver.config.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Map<String, Object> response = loginService.authenticate(request);
            return ResponseEntity.ok(new ApiResponse<Map<String, Object>>(response, "Login successful", 200));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(
                new ApiResponse<String>(e.getMessage(), 401)
            );
        }
    }
}