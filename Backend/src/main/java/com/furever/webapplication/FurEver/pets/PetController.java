package com.furever.webapplication.FurEver.pets;

import com.furever.webapplication.FurEver.user.UserEntity;
import com.furever.webapplication.FurEver.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class PetController {

    private final PetService petService;
    private final PetRepository petRepository;
    private final UserRepository userRepository;

    public PetController(PetService petService, PetRepository petRepository, UserRepository userRepository) {
        this.petService = petService;
        this.petRepository = petRepository;
        this.userRepository = userRepository;
    }

    // 1. GET ALL PETS (Public)
    @GetMapping 
    public ResponseEntity<List<PetEntity>> getAllPets() {
        return ResponseEntity.ok(petRepository.findAll());
    }

    // 2. ADD PET (Admin Only - Handles File Upload)
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
    ) throws IOException {

        // Save file to "uploads" folder in project root
        String uploadDir = "uploads/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

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
        
        // This is the URL React will use to show the image
        pet.setImage("http://localhost:8080/api/pets/images/" + fileName); 

        return ResponseEntity.ok(petService.addPet(pet));
    }

    // 3. GET IMAGES (Allows browser to see the uploaded files)
    @GetMapping("/images/{filename:.+}")
    @ResponseBody
    public org.springframework.core.io.Resource getImage(@PathVariable String filename) throws IOException {
        Path filePath = Paths.get("uploads/").resolve(filename);
        return new org.springframework.core.io.UrlResource(filePath.toUri());
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
    ) throws IOException {
        
        PetEntity pet = petRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pet not found"));

        // If a new image is provided, upload it and update the path
        if (file != null && !file.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get("uploads/").resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            pet.setImage("http://localhost:8080/api/pets/images/" + fileName);
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

    // 6. DELETE PET (Admin Only - Includes file cleanup)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePet(@PathVariable Integer id) {
        return petRepository.findById(id).map(pet -> {
            try {
                // Delete the physical image file from the /uploads folder
                String imageUrl = pet.getImage();
                if (imageUrl != null && imageUrl.contains("/images/")) {
                    String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
                    Path filePath = Paths.get("uploads/").resolve(fileName);
                    Files.deleteIfExists(filePath);
                }
                
                petRepository.delete(pet);
                return ResponseEntity.ok().build();
            } catch (IOException e) {
                return ResponseEntity.internalServerError().body("Failed to delete image file");
            }
        }).orElse(ResponseEntity.notFound().build());
    }
}