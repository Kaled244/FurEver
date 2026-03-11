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
    public ResponseEntity<HealthRecordsEntity> addHealthRecord(@RequestBody HealthRecordsEntity record) {
        HealthRecordsEntity savedRecord = healthRepository.save(record);
        return ResponseEntity.ok(savedRecord);
    }

}