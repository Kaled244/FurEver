package com.furever.webapplication.FurEver.healthrecords;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HealthRecordsRepository extends JpaRepository<HealthRecordsEntity, Integer> {
    // Custom query to find records by Pet ID
    List<HealthRecordsEntity> findByPId(Integer pId);
}
