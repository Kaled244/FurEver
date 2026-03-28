package com.furever.webapplication.FurEver.application;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;

import com.furever.webapplication.FurEver.user.UserRepository;
import com.furever.webapplication.FurEver.pets.PetRepository;
import com.furever.webapplication.FurEver.config.ApiResponse;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final ApplicationRepository appRepository;

    public StatsController(UserRepository userRepository, 
                           PetRepository petRepository, 
                           ApplicationRepository appRepository) {
        this.userRepository = userRepository;
        this.petRepository = petRepository;
        this.appRepository = appRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        
        // Ensure these methods exist in your repositories!
        stats.put("totalAdopted", petRepository.countByStatus("adopted"));
        stats.put("activeMembers", userRepository.count());
        stats.put("successStories", appRepository.countByStatus("APPROVED"));

        return ResponseEntity.ok(new ApiResponse<>(stats, "Stats loaded successfully", 200));
    }
}