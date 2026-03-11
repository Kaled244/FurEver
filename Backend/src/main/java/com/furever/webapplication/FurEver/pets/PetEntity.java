package com.furever.webapplication.FurEver.pets;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.furever.webapplication.FurEver.healthrecords.HealthRecordsEntity;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "pets")
public class PetEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "p_id")
    @JsonProperty("pId")
    private Integer id;

    @Column(name = "p_name")
    @JsonProperty("pName")
    private String name;

    @Column(name = "p_age")
    @JsonProperty("pAge")
    private Integer age;

    @Column(name = "p_breed")
    @JsonProperty("pBreed")
    private String breed;

    @Column(name = "p_species")
    @JsonProperty("pSpecies")
    private String species;

    @Column(name = "p_gender")
    @JsonProperty("pGender")
    private String gender;

    @Column(name = "p_status")
    @JsonProperty("pStatus")
    private String status;

    @Column(name = "p_price")
    @JsonProperty("pPrice")
    private String price;

    @Column(name = "p_image")
    @JsonProperty("pImage")
    private String image;

    @Column(name = "p_description", columnDefinition = "TEXT")
    @JsonProperty("pDescription")
    private String description;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "p_id", referencedColumnName = "p_id", insertable = false, updatable = false)
    @JsonProperty("healthRecords")
    private List<HealthRecordsEntity> healthRecords;

    public PetEntity() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }
    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public List<HealthRecordsEntity> getHealthRecords() { return healthRecords; }
    public void setHealthRecords(List<HealthRecordsEntity> healthRecords) { this.healthRecords = healthRecords; }
}