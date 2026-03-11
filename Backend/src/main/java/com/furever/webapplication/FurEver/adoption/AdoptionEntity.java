package com.furever.webapplication.FurEver.adoption;

import com.furever.webapplication.FurEver.application.ApplicationEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "adoption")
public class AdoptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "adopt_id")
    private Integer adoptId;

    @OneToOne
    @JoinColumn(name = "app_id", nullable = false)
    private ApplicationEntity application;

    @Column(name = "adopt_date")
    private LocalDateTime adoptDate = LocalDateTime.now();

    @Column(name = "pay_status")
    private String payStatus = "UNPAID"; // Default status

    public AdoptionEntity() {}

    public Integer getAdoptId() { return adoptId; }
    public void setAdoptId(Integer adoptId) { this.adoptId = adoptId; }

    public ApplicationEntity getApplication() { return application; }
    public void setApplication(ApplicationEntity application) { this.application = application; }

    public LocalDateTime getAdoptDate() { return adoptDate; }
    public void setAdoptDate(LocalDateTime adoptDate) { this.adoptDate = adoptDate; }

    public String getPayStatus() { return payStatus; }
    public void setPayStatus(String payStatus) { this.payStatus = payStatus; }
}