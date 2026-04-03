package com.furever.webapplication.FurEver.pets;

import com.furever.webapplication.FurEver.user.UserEntity;
import com.furever.webapplication.FurEver.user.UserRepository;
import com.furever.webapplication.FurEver.storage.SupabaseStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final SupabaseStorageService storageService;

    public PetController(PetService petService, PetRepository petRepository, UserRepository userRepository, SupabaseStorageService storageService) {
        this.petService = petService;
        this.petRepository = petRepository;
        this.userRepository = userRepository;
        this.storageService = storageService;
    }

    // 1. GET ALL PETS (Public)
    @GetMapping 
    public ResponseEntity<List<PetEntity>> getAllPets() {
        return ResponseEntity.ok(petRepository.findAll());
    }

    // 2. ADD PET (Admin Only - Handles File Upload via Supabase)
    @PostMapping("/add")
    public ResponseEntity<PetEntity> addPet(
        @RequestParam("pImage") MultipartFile file, 
        @RequestParam("pName") String pName,
        @RequestParam("pSpecies") String pSpecies,
        @RequestParam("pBreed") String pBreed,
        @RequestParam("pAge") Integer pAge,
        @RequestParam("pGender") String pGender,
        @RequestParam("pDescription") String pDescription,
        @RequestParam("pStatus") String pStatus,
        @RequestParam("pPrice") String pPrice
    ) throws Exception {

        // Upload to Supabase instead of local storage
        String imageUrl;
        if (file != null && !file.isEmpty()) {
            imageUrl = storageService.uploadImage(file);
        } else {
            imageUrl = "https://placehold.co/400x300?text=No+Photo";
        }

        // Map to Entity
        PetEntity pet = new PetEntity();
        pet.setName(pName);
        pet.setSpecies(pSpecies);
        pet.setBreed(pBreed);
        pet.setAge(pAge);
        pet.setGender(pGender);
        pet.setDescription(pDescription);
        pet.setStatus(pStatus);
        pet.setPrice(pPrice);
        
        // Store the Supabase URL directly
        pet.setImage(imageUrl); 

        return ResponseEntity.ok(petService.addPet(pet));
    }

    // 3. GET IMAGES (Legacy endpoint - Returns 404 since we use Supabase now)
    @GetMapping("/images/{filename:.+}")
    @ResponseBody
    public ResponseEntity<?> getImage(@PathVariable String filename) {
        // Images are now served directly from Supabase URLs in the database
        // This endpoint is deprecated
        return ResponseEntity.status(404).body("Images are stored in Supabase. Access them via the pet object's pImage URL.");
    }

    // 4. GET MY ADOPTED PETS
    @GetMapping("/my-pets")
    public ResponseEntity<List<PetEntity>> getMyAdoptedPets() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(petRepository.findAdoptedPetsByUserId(user.getUserId()));
    }

    // 5. UPDATE PET (Admin Only)
    @PutMapping("/update/{id}")
    public ResponseEntity<PetEntity> updatePet(
        @PathVariable Integer id,
        @RequestParam(value = "pImage", required = false) MultipartFile file,
        @RequestParam("pName") String pName,
        @RequestParam("pSpecies") String pSpecies,
        @RequestParam("pBreed") String pBreed,
        @RequestParam("pAge") Integer pAge,
        @RequestParam("pGender") String pGender,
        @RequestParam("pDescription") String pDescription,
        @RequestParam("pStatus") String pStatus,
        @RequestParam("pPrice") String pPrice
    ) throws Exception {
        
        PetEntity pet = petRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pet not found"));

        // If a new image is provided, upload it to Supabase
        if (file != null && !file.isEmpty()) {
            String imageUrl = storageService.uploadImage(file);
            pet.setImage(imageUrl);
        }

        pet.setName(pName);
        pet.setSpecies(pSpecies);
        pet.setBreed(pBreed);
        pet.setAge(pAge);
        pet.setGender(pGender);
        pet.setDescription(pDescription);
        pet.setStatus(pStatus);
        pet.setPrice(pPrice);

        return ResponseEntity.ok(petRepository.save(pet));
    }

    // 6. DELETE PET (Admin Only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePet(@PathVariable Integer id) {
        return petRepository.findById(id).map(pet -> {
            // Images are stored in Supabase, so no local file cleanup needed
            // Supabase will handle storage cleanup
            petRepository.delete(pet);
            return ResponseEntity.ok().body("Pet deleted successfully");
        }).orElse(ResponseEntity.notFound().build());
    }
}