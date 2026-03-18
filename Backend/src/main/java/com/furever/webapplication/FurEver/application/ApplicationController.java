package com.furever.webapplication.FurEver.application;

import com.furever.webapplication.FurEver.adoption.AdoptionEntity;
import com.furever.webapplication.FurEver.adoption.AdoptionRepository;
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
    private final AdoptionRepository adoptionRepository; // Added for the final stage

    public ApplicationController(ApplicationRepository applicationRepository,
                                 UserRepository userRepository,
                                 PetRepository petRepository,
                                 AdoptionRepository adoptionRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.petRepository = petRepository;
        this.adoptionRepository = adoptionRepository;
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(@RequestBody ApplicationRequest request) {
    if (request.petId() == null) {
        return ResponseEntity.badRequest().body("Pet ID is required");
    }

    String username = SecurityContextHolder.getContext().getAuthentication().getName();

    UserEntity user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

    @SuppressWarnings("null")
    PetEntity pet = petRepository.findById(request.petId())
            .orElseThrow(() -> new RuntimeException("Pet not found"));

    if (applicationRepository.existsByUserAndPet(user, pet)) {
        return ResponseEntity.badRequest().body("You've already applied for " + pet.getName());
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

    applicationRepository.save(application);

    return ResponseEntity.ok("Application submitted successfully for " + pet.getName() + "!");
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<ApplicationEntity>> getAllApplications() {
        return ResponseEntity.ok(applicationRepository.findAll());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable int id, @RequestBody String newStatus) {
    ApplicationEntity application = applicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found"));

        String cleanStatus = newStatus.replace("\"", "").trim().toUpperCase();

        List<String> validStatuses = List.of("APPROVED", "REJECTED", "PENDING");
        if (!validStatuses.contains(cleanStatus)) {
            return ResponseEntity.badRequest()
                    .body("Invalid Status! Please use APPROVED, REJECTED, or PENDING.");
        }

        application.setStatus(cleanStatus);
        applicationRepository.save(application);


        if ("APPROVED".equals(cleanStatus)) {

            PetEntity pet = application.getPet();
            pet.setStatus("adopted");
            petRepository.save(pet);

            AdoptionEntity adoption = new AdoptionEntity();
            adoption.setApplication(application);
            adoption.setPayStatus("UNPAID");
            adoptionRepository.save(adoption);
        }

        return ResponseEntity.ok("Application #" + id + " for " + application.getPet().getName() + " has been marked as " + cleanStatus);
    }
    
    @PatchMapping("/adoption/{id}/pay")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable int id) {

    AdoptionEntity adoption = adoptionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Adoption record not found"));

    adoption.setPayStatus("PAID");

    adoptionRepository.save(adoption);
    return ResponseEntity.ok("Payment confirmed for Adoption #" + id + ". Muning is officially going home!");
    }
    @GetMapping("/adoptions/unpaid")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<AdoptionEntity>> getUnpaidAdoptions() {
        return ResponseEntity.ok(adoptionRepository.findByPayStatus("UNPAID"));
    }

    @GetMapping("/my-submissions")
    public ResponseEntity<List<ApplicationEntity>> getMyApplications() {
    String username = SecurityContextHolder.getContext().getAuthentication().getName();
    UserEntity user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
    
    return ResponseEntity.ok(applicationRepository.findByUser(user));
}
}