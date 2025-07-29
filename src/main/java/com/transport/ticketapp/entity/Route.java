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
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Route {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 100)
    private String routeName;
    
    @NotBlank
    @Size(max = 100)
    private String departureCity;
    
    @NotBlank
    @Size(max = 100)
    private String arrivalCity;
    
    @NotNull
    private LocalTime departureTime;
    
    @NotNull
    private LocalTime arrivalTime;
    
    @NotNull
    @Positive
    @Column(precision = 10, scale = 2)
    private BigDecimal price;
    
    @NotNull
    @Positive
    private Integer totalSeats;
    
    @NotNull
    private Integer availableSeats;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private TransportType transportType;
    
    @Size(max = 500)
    private String description;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Ticket> tickets = new HashSet<>();
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    public enum TransportType {
        BUS,
        TRAIN,
        METRO,
        TRAMWAY
    }
}