package com.furever.webapplication.FurEver.pets;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<PetEntity, Integer> {

    @Query("SELECT p FROM PetEntity p WHERE p.user.id = :userId AND p.status = 'adopted'")
    List<PetEntity> findAdoptedPetsByUserId(@Param("userId") Integer userId);

    long countByStatus(String status);
}