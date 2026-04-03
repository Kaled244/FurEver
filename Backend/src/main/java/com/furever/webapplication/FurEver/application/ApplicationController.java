package com.furever.webapplication.FurEver.application;

import com.furever.webapplication.FurEver.adoption.AdoptionEntity;
import com.furever.webapplication.FurEver.adoption.AdoptionRepository;
import com.furever.webapplication.FurEver.config.ApiResponse;
import com.furever.webapplication.FurEver.pets.PetEntity;
import com.furever.webapplication.FurEver.pets.PetRepository;
import com.furever.webapplication.FurEver.user.UserEntity;
import com.furever.webapplication.FurEver.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final AdoptionRepository adoptionRepository;

    public ApplicationController(ApplicationRepository applicationRepository,
            UserRepository userRepository,
            PetRepository petRepository,
            AdoptionRepository adoptionRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.petRepository = petRepository;
        this.adoptionRepository = adoptionRepository;
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<List<ApplicationEntity>>> getAllApplications() {
        List<ApplicationEntity> apps = applicationRepository.findAll();
        // Wrapping in ApiResponse
        return ResponseEntity.ok(new ApiResponse<>(apps, "Applications retrieved", 200));
    }

    @PostMapping("/submit")
    @PreAuthorize("hasAuthority('ADOPTER')")
    public ResponseEntity<ApiResponse<ApplicationEntity>> submitApplication(@RequestBody ApplicationRequest request) {
        
        // Validate required fields
        if (request.petId() == null || request.appContact() == null || 
            request.appContact().trim().isEmpty() || request.appAnswer() == null || 
            request.appAnswer().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("All fields are required", 400));
        }
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PetEntity pet = petRepository.findById(request.petId())
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        // Check if user already has an ACTIVE application for this pet
        boolean hasActiveApp = applicationRepository.existsByUserAndPetAndStatusNot(user, pet, "REJECTED");
        
        if (hasActiveApp) {
            System.out.println("❌ User " + user.getUsername() + " already has active application for pet " + pet.getName());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("You already submitted an application for this pet.", 400));
        }

        ApplicationEntity application = new ApplicationEntity();
        application.setUser(user);
        application.setPet(pet);
        application.setContactNumber(request.appContact());
        application.setHomeType(request.appHomeType());
        application.setExperience(request.appExperience());
        application.setNewPetName(request.appNewpetname());
        application.setAnswers(request.appAnswer());
        application.setStatus("PENDING");

        ApplicationEntity savedApp = applicationRepository.save(application);
        System.out.println("✅ Application created - User: " + user.getUsername() + ", Pet: " + pet.getName() + ", AppId: " + savedApp.getId());

        return ResponseEntity.ok(new ApiResponse<>(savedApp, "Application submitted!", 200));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("authenticated()")
    public ResponseEntity<ApiResponse<ApplicationEntity>> updateStatus(@PathVariable int id,
            @RequestBody java.util.Map<String, String> statusUpdate) {

        String newStatus = statusUpdate.get("status");
        if (newStatus == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>("Missing status in request body", 400));
        }

        String cleanStatus = newStatus.trim().toUpperCase();

        ApplicationEntity application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ADMIN"));

        // SECURITY CHECK
        if (!isAdmin) {
            if (!application.getUser().getUsername().equals(currentUsername)) {
                return ResponseEntity.status(403)
                        .body(new ApiResponse<>("Forbidden: This is not your application!", 403));
            }
            // Users are allowed to move to READY_TO_CLAIM (Claiming) or ADOPTED (Confirming
            // pickup)
            List<String> allowedUserStatuses = List.of("READY_TO_CLAIM", "ADOPTED");
            if (!allowedUserStatuses.contains(cleanStatus)) {
                return ResponseEntity.status(403)
                        .body(new ApiResponse<>("Forbidden: Users cannot set this status.", 403));
            }
        }

        // 1. UPDATE THE STATUS
        application.setStatus(cleanStatus);
        applicationRepository.save(application);

        // 2. LOGIC FOR STATUS CHANGES
        if ("APPROVED".equals(cleanStatus) || "ADOPTED".equals(cleanStatus)) {
            PetEntity pet = application.getPet();
            UserEntity applicant = application.getUser();

            if (pet != null) {
                pet.setUser(applicant);

                pet.setStatus("adopted");
                petRepository.save(pet);
            }

            // 3. Handle the Adoption Record (Receipt/Payment tracking)
            if (!adoptionRepository.existsByApplication(application)) {
                AdoptionEntity adoption = new AdoptionEntity();
                adoption.setApplication(application);
                adoption.setPayStatus("UNPAID");
                adoptionRepository.save(adoption);
            }
        }

        return ResponseEntity.ok(new ApiResponse<>(application, "Status updated to " + cleanStatus, 200));
    }

    @PatchMapping("/adoption/{id}/pay")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<AdoptionEntity>> updatePaymentStatus(@PathVariable int id) {
        AdoptionEntity adoption = adoptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Adoption record not found"));

        adoption.setPayStatus("PAID");
        adoptionRepository.save(adoption);

        return ResponseEntity
                .ok(new ApiResponse<>(adoption, "Payment confirmed. Muning is officially going home!", 200));
    }

    @GetMapping("/adoptions/unpaid")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<AdoptionEntity>> getUnpaidAdoptions() {
        return ResponseEntity.ok(adoptionRepository.findByPayStatus("UNPAID"));
    }

    @GetMapping("/my-submissions")
    public ResponseEntity<ApiResponse<List<ApplicationEntity>>> getMyApplications() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ApplicationEntity> applications = applicationRepository.findByUser(user);
        return ResponseEntity.ok(new ApiResponse<>(applications, "Applications retrieved successfully", 200));
    }
}