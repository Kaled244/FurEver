package com.furever.webapplication.FurEver.application;

import com.furever.webapplication.FurEver.pets.PetEntity;
import com.furever.webapplication.FurEver.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<ApplicationEntity, Integer> {
    boolean existsByUserAndPet(UserEntity user, PetEntity pet);

    // Check for active applications (not rejected)
    boolean existsByUserAndPetAndStatusNot(UserEntity user, PetEntity pet, String status);

    List<ApplicationEntity> findByUser(UserEntity user);
    long countByStatus(String status);
}