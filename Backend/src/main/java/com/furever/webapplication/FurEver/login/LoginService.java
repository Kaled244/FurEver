package com.furever.webapplication.FurEver.login;

import com.furever.webapplication.FurEver.config.JwtService;
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

    public LoginService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public Map<String, Object> authenticate(LoginRequest req) {
        // 1. Find the user
        UserEntity user = userRepository.findByUsername(req.username())
                .orElseThrow(() -> new RuntimeException("Error: Invalid Credentials!"));

        // 2. Verify password
        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new RuntimeException("Error: Invalid Credentials!");
        }

        // 3. Generate Token (passing both Username and Role as we fixed earlier)
        String token = jwtService.generateToken(user.getUsername(), user.getRole());

        // 4. Return data needed by the frontend
        return Map.of(
                "message", "Login successful!",
                "token", token,
                "role", user.getRole(),
                "username", user.getUsername()
        );
    }
}