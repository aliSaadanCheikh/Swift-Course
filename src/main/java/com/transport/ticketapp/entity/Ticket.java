package com.transport.ticketapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Ticket {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 50)
    @Column(unique = true)
    private String ticketNumber;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;
    
    @NotNull
    private LocalDate travelDate;
    
    @NotNull
    @Positive
    @Column(precision = 10, scale = 2)
    private BigDecimal price;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private TicketStatus status;
    
    @Size(max = 10)
    private String seatNumber;
    
    @Size(max = 500)
    private String notes;
    
    // Informations de paiement
    @Size(max = 100)
    private String paymentIntentId;
    
    @Size(max = 50)
    private String paymentMethod;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    public enum TicketStatus {
        PENDING,
        CONFIRMED,
        USED,
        CANCELLED,
        REFUNDED
    }
}