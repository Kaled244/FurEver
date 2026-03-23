package com.furever.webapplication.FurEver.login;

import com.furever.webapplication.FurEver.config.JwtService;
import com.furever.webapplication.FurEver.config.RefreshTokenService;
import com.furever.webapplication.FurEver.user.UserEntity;
import com.furever.webapplication.FurEver.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class LoginService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public LoginService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    public Map<String, Object> authenticate(LoginRequest req) {
        // 1. Find the user
        UserEntity user = userRepository.findByUsername(req.username())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // 2. Verify password
        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // 3. Generate token pair (access + refresh) for better mobile support
        Map<String, Object> tokens = refreshTokenService.generateTokenPair(user.getUsername(), user.getRole());

        // 4. Return data needed by both web and mobile
        return Map.of(
                "message", "Login successful!",
                "token", tokens.get("accessToken"),  // For frontend compatibility
                "tokens", tokens,                     // For mobile clients
                "role", user.getRole(),
                "username", user.getUsername()
        );
    }
}