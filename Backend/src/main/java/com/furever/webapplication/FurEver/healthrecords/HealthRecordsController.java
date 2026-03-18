package com.furever.webapplication.FurEver.healthrecords;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health")
public class HealthRecordsController  {

    private final HealthRecordsRepository healthRepository;

    public HealthRecordsController(HealthRecordsRepository healthRepository) {
        this.healthRepository = healthRepository;
    }
    @GetMapping("/pet/{pId}")
    public ResponseEntity<List<HealthRecordsEntity>>getHealthByPet(@PathVariable Integer pId) {
        return ResponseEntity.ok(healthRepository.findByPId(pId));
    }
    @PostMapping("/add")
    public ResponseEntity<HealthRecordsEntity> addHealthRecord(@RequestBody HealthRecordsEntity healthRecord) {
    if (healthRecord == null) {
        return ResponseEntity.badRequest().build();
    }
    HealthRecordsEntity savedRecord = healthRepository.save(healthRecord);
    return ResponseEntity.ok(savedRecord);
    }

}