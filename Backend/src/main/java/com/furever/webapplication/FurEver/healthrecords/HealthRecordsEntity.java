package com.furever.webapplication.FurEver.healthrecords;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "health_records")
public class HealthRecordsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "health_id")
    @JsonProperty("healthId")
    private Integer healthId;

    @Column(name = "p_id")
    @JsonProperty("pId")
    private Integer pId;

    @Column(name = "vac_date")
    @JsonProperty("vacDate") 
    private LocalDate vacDate;

    @Column(name = "vac_type")
    @JsonProperty("vacType")
    private String vacType;

    public HealthRecordsEntity() {}

    public Integer getHealthId() {
        return healthId;
    }

    public void setHealthId(Integer healthId) {
        this.healthId = healthId;
    }

    public Integer getpId() {
        return pId;
    }

    public void setpId(Integer pId) {
        this.pId = pId;
    }

    public LocalDate getVacDate() {
        return vacDate;
    }

    public void setVacDate(LocalDate vacDate) {
        this.vacDate = vacDate;
    }

    public String getVacType() {
        return vacType;
    }

    public void setVacType(String vacType) {
        this.vacType = vacType;
    }
}