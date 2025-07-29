package com.transport.ticketapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteDto {
    
    private Long id;
    
    @NotBlank(message = "La ville de départ est obligatoire")
    private String departureCity;
    
    @NotBlank(message = "La ville d'arrivée est obligatoire")
    private String arrivalCity;
    
    @NotNull(message = "L'heure de départ est obligatoire")
    private LocalTime departureTime;
    
    @NotNull(message = "L'heure d'arrivée est obligatoire")
    private LocalTime arrivalTime;
    
    @NotNull(message = "Le prix est obligatoire")
    @Positive(message = "Le prix doit être positif")
    private BigDecimal price;
    
    @NotBlank(message = "Le type de transport est obligatoire")
    private String transportType;
    
    @NotBlank(message = "Le nom de la compagnie est obligatoire")
    private String companyName;
    
    @Positive(message = "Le nombre de sièges disponibles doit être positif")
    private Integer availableSeats;
    
    private String description;
    
    private Boolean active = true;
}