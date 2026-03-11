package com.furever.webapplication.FurEver.auth;

import com.furever.webapplication.FurEver.config.JwtService;
import com.furever.webapplication.FurEver.user.UserEntity;
import com.furever.webapplication.FurEver.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // 1. LOGIN: This is where the 403 fix starts!
    public String login(String username, String password) {
        // Find user in Supabase
        Optional<UserEntity> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            // Check if password matches the encrypted one in DB
            if (passwordEncoder.matches(password, user.getPassword())) {
                // IMPORTANT: We pass the username AND the role here
                return jwtService.generateToken(user.getUsername(), user.getRole());
            }
        }
        throw new RuntimeException("Invalid username or password");
    }

    // 2. REGISTER: To create new Admins or Users
    public UserEntity register(UserEntity user) {
        // Encrypt the password before saving to Supabase
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Default role if not provided
        if (user.getRole() == null) {
            user.setRole("USER");
        }
        return userRepository.save(user);
    }
}