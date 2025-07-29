package com.transport.ticketapp.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketPurchaseDto {
    
    @NotNull(message = "L'ID de la route est obligatoire")
    private Long routeId;
    
    @NotNull(message = "La date de voyage est obligatoire")
    private LocalDate travelDate;
    
    @NotNull(message = "Le nombre de billets est obligatoire")
    @Positive(message = "Le nombre de billets doit être positif")
    private Integer quantity;
    
    private String passengerName;
    private String passengerPhone;
    private String specialRequests;
}