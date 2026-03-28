package com.furever.webapplication.FurEver.application;

import com.furever.webapplication.FurEver.pets.PetEntity;
import com.furever.webapplication.FurEver.user.UserEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "application")
public class ApplicationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "app_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "p_id", nullable = false)
    private PetEntity pet;

    @Column(name = "app_contact")
    private String contactNumber;

    @Column(name = "app_home_type")
    private String homeType;

    @Enumerated(EnumType.STRING)
    @Column(name = "app_experience")
    private ExperienceLevel experience;

    @Column(name = "app_new_pet_name")
    private String newPetName;

    @Column(name = "app_answer", columnDefinition = "TEXT")
    private String answers;

    @Column(name = "app_status")
    private String status = "PENDING";

    @Column(name = "app_date")
    private LocalDateTime appDate = LocalDateTime.now();

    public ApplicationEntity() {}

    // Getters and Setters...
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }
    public PetEntity getPet() { return pet; }
    public void setPet(PetEntity pet) { this.pet = pet; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public String getHomeType() { return homeType; }
    public void setHomeType(String homeType) { this.homeType = homeType; }
    public ExperienceLevel getExperience() { return experience; }
    public void setExperience(ExperienceLevel experience) { this.experience = experience; }
    public String getNewPetName() { return newPetName; }
    public void setNewPetName(String newPetName) { this.newPetName = newPetName; }
    public String getAnswers() { return answers; }
    public void setAnswers(String answers) { this.answers = answers; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getAppDate() { return appDate; }
    public void setAppDate(LocalDateTime appDate) { this.appDate = appDate; }
}