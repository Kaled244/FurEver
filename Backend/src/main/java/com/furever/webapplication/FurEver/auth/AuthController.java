package com.furever.webapplication.FurEver.auth;

import com.furever.webapplication.FurEver.config.JwtService;
import com.furever.webapplication.FurEver.user.UserEntity;
import com.furever.webapplication.FurEver.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserEntity user) {
        // 1. Check if user exists
        if (userService.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Username is already taken!"));
        }

        // 2. Assign Role based on email
        if (user.getEmail() != null && user.getEmail().endsWith("@fureveradmin.com")) {
            user.setRole("ADMIN");
        } else {
            user.setRole("ADOPTER");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userService.saveUser(user);

        String token = jwtService.generateToken(user.getUsername(), user.getRole());

        return ResponseEntity.ok(Map.of(
                "message", "User registered as " + user.getRole(),
                "token", token,
                "role", user.getRole()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        UserEntity user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Error: Invalid Credentials!"));
        }

        if (passwordEncoder.matches(password, user.getPassword())) {
            String token = jwtService.generateToken(user.getUsername(), user.getRole());
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful!",
                    "token", token,
                    "role", user.getRole(),
                    "username", user.getUsername()
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Error: Invalid Credentials!"));
        }
    }
}