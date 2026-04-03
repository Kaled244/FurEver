package com.furever.webapplication.FurEver.application;

import com.furever.webapplication.FurEver.pets.PetEntity;
import com.furever.webapplication.FurEver.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<ApplicationEntity, Integer> {
    boolean existsByUserAndPet(UserEntity user, PetEntity pet);
    
    // Check for active applications (not rejected)
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM ApplicationEntity a " +
           "WHERE a.user = :user AND a.pet = :pet AND a.status NOT IN ('REJECTED')")
    boolean existsActiveApplicationByUserAndPet(UserEntity user, PetEntity pet);
    
    List<ApplicationEntity> findByUser(UserEntity user);
    long countByStatus(String status);
}