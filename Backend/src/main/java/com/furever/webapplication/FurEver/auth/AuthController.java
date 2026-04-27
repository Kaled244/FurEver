package com.furever.webapplication.FurEver.auth;

import com.furever.webapplication.FurEver.config.JwtService;
import com.furever.webapplication.FurEver.config.ApiResponse;
import com.furever.webapplication.FurEver.config.RefreshTokenService;
import com.furever.webapplication.FurEver.user.UserEntity;
import com.furever.webapplication.FurEver.user.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder, JwtService jwtService, RefreshTokenService refreshTokenService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserEntity user) {
        // 1. Check if user exists
        if (userService.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body(
                new ApiResponse<String>(
                    "Error: Username is already taken!",
                    400
                )
            );
        }

        // 2. Assign Role based on email
        if (user.getEmail() != null && user.getEmail().endsWith("@fureveradmin.com")) {
            user.setRole("ADMIN");
        } else {
            user.setRole("ADOPTER");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.saveUser(user);

        // Generate ONLY access token for web (skip refresh token overhead)
        String accessToken = jwtService.generateToken(user.getUsername(), user.getRole());

        Map<String, Object> data = Map.of(
            "message", "User registered as " + user.getRole(),
            "token", accessToken,
            "role", user.getRole(),
            "username", user.getUsername()
        );

        return ResponseEntity.ok(new ApiResponse<Map<String, Object>>(data, "Registration successful", 200));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        if (username == null || username.isBlank()) {
            return ResponseEntity.badRequest().body(
                new ApiResponse<String>("Username is required", 400)
            );
        }

        if (password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(
                new ApiResponse<String>("Password is required", 400)
            );
        }

        UserEntity user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new ApiResponse<String>("Invalid credentials", 401)
            );
        }

        if (passwordEncoder.matches(password, user.getPassword())) {
            
            // Fix null roles natively in DB for legacy accounts if missing
            String role = user.getRole();
            if (role == null || role.isBlank()) {
                if ("admin".equalsIgnoreCase(user.getUsername()) || (user.getEmail() != null && user.getEmail().endsWith("@fureveradmin.com"))) {
                    role = "ADMIN";
                } else {
                    role = "ADOPTER";
                }
                user.setRole(role);
                userService.saveUser(user); // Auto-update to the DB
            }

            // Generate ONLY access token for web (skip refresh token overhead)
            String accessToken = jwtService.generateToken(user.getUsername(), role);

            java.util.Map<String, Object> data = new java.util.HashMap<>();
            data.put("token", accessToken);
            data.put("role", role);
            data.put("username", user.getUsername());
            data.put("name", user.getName()); // Add name as it's used in the frontend

            return ResponseEntity.ok(new ApiResponse<java.util.Map<String, Object>>(data, "Login successful", 200));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new ApiResponse<String>("Invalid credentials", 401)
            );
        }
    }

    /**
     * Refresh access token endpoint
     * Mobile apps can use expired access token to get a new one
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.badRequest().body(
                new ApiResponse<String>("Refresh token is required", 400)
            );
        }

        try {
            String newAccessToken = refreshTokenService.refreshAccessToken(refreshToken);
            Map<String, Object> data = Map.of(
                "accessToken", newAccessToken,
                "expiresIn", 86400
            );
            return ResponseEntity.ok(new ApiResponse<Map<String, Object>>(data, "Token refreshed", 200));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new ApiResponse<String>("Invalid refresh token: " + e.getMessage(), 401)
            );
        }
    }

    /**
     * Logout endpoint
     * Invalidates refresh token on mobile apps
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenService.revokeRefreshToken(refreshToken);
        }
        
        return ResponseEntity.ok(new ApiResponse<String>("Logged out successfully", 200));
    }
}