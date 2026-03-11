package com.furever.webapplication.FurEver.pets;

import com.furever.webapplication.FurEver.user.UserEntity;
import com.furever.webapplication.FurEver.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class PetController {

    private final PetService petService;
    private final PetRepository petRepository;
    private final UserRepository userRepository; // Added this field

    public PetController(PetService petService, PetRepository petRepository, UserRepository userRepository) {
        this.petService = petService;
        this.petRepository = petRepository;
        this.userRepository = userRepository;
    }

    @GetMapping 
    public ResponseEntity<List<PetEntity>> getAllPets() {
        return ResponseEntity.ok(petRepository.findAll());
    }

    @PostMapping("/add")
    public ResponseEntity<PetEntity> addPet(@RequestBody PetEntity pet) {
        return ResponseEntity.ok(petService.addPet(pet));
    }

    @GetMapping("/my-pets")
    public ResponseEntity<List<PetEntity>> getMyAdoptedPets() {
    String username = SecurityContextHolder.getContext().getAuthentication().getName();

    UserEntity user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
    List<PetEntity> myPets = petRepository.findAdoptedPetsByUserId(user.getUserId());
    
    return ResponseEntity.ok(myPets);
    }
}