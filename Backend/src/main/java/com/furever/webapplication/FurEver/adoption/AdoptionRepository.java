package com.furever.webapplication.FurEver.adoption;

import com.furever.webapplication.FurEver.application.ApplicationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdoptionRepository extends JpaRepository<AdoptionEntity, Integer> {
    boolean existsByApplication(ApplicationEntity application);
    Optional<AdoptionEntity> findByApplication(ApplicationEntity application);
    java.util.List<AdoptionEntity> findByPayStatus(String payStatus);
}