package com.furever.webapplication.FurEver.adoption;

import com.furever.webapplication.FurEver.adoption.AdoptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AdoptionRepository extends JpaRepository<AdoptionEntity, Integer> {

    // Spring generates this SQL automatically:
    List<AdoptionEntity> findByPayStatus(String status);
}