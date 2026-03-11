package com.furever.webapplication.FurEver.pets;

import org.springframework.stereotype.Service;

@Service
public class PetService {

    private final PetRepository petRepository;

    // Constructor Injection (Fixes "Field injection not recommended")
    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    public PetEntity addPet(PetEntity pet) {
        // Fix: Use getStatus() and setStatus()
        if (pet.getStatus() == null || pet.getStatus().isEmpty()) {
            pet.setStatus("available");
        }

        return petRepository.save(pet);
    }
}