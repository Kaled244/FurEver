package com.furever.webapplication.FurEver.profile;

import com.furever.webapplication.FurEver.user.UserEntity;
import com.furever.webapplication.FurEver.user.UserRepository;
import com.furever.webapplication.FurEver.storage.SupabaseStorageService; // Ensure this import matches your project structure
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SupabaseStorageService storageService; // 1. Added the service

    public ProfileController(UserRepository userRepository, 
                             PasswordEncoder passwordEncoder, 
                             SupabaseStorageService storageService) { // 2. Added to constructor
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.storageService = storageService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserEntity> getMyProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Current password is incorrect"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
    
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @RequestParam("name") String name,
            @RequestParam("l_name") String lName,
            @RequestParam("username") String username,
            @RequestParam("address") String address,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar) {
            
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(name);
        user.setLName(lName);
        user.setUsername(username);
        user.setAddress(address);

        // 3. Logic to handle the avatar upload
        if (avatar != null && !avatar.isEmpty()) {
            try {

                String publicUrl = storageService.uploadImage(avatar);
                user.setAvatarUrl(publicUrl); 
                System.out.println("Successfully uploaded avatar for: " + username);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Failed to upload avatar: " + e.getMessage()));
            }
        }

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}