# Tutoriel : Application de Vente de Billets de Transport
## Java Backend + MySQL

### Table des matières
1. [Préparation de l'environnement](#1-préparation-de-lenvironnement)
2. [Configuration de la base de données](#2-configuration-de-la-base-de-données)
3. [Création du projet Java](#3-création-du-projet-java)
4. [Structure du projet](#4-structure-du-projet)
5. [Configuration Spring Boot](#5-configuration-spring-boot)
6. [Modèles de données](#6-modèles-de-données)
7. [Repositories](#7-repositories)
8. [Services](#8-services)
9. [Contrôleurs REST](#9-contrôleurs-rest)
10. [Tests](#10-tests)
11. [Déploiement](#11-déploiement)

---

## 1. Préparation de l'environnement

### 1.1 Installation des outils nécessaires

```bash
# Vérifier Java (version 11 ou supérieure)
java -version

# Si Java n'est pas installé
sudo apt update
sudo apt install openjdk-11-jdk

# Installer Maven
sudo apt install maven

# Vérifier Maven
mvn -version

# Installer MySQL
sudo apt install mysql-server

# Démarrer MySQL
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 1.2 Configuration initiale de MySQL

```bash
# Sécuriser l'installation MySQL
sudo mysql_secure_installation

# Se connecter à MySQL
sudo mysql -u root -p

# Créer la base de données
CREATE DATABASE transport_tickets;

# Créer un utilisateur pour l'application
CREATE USER 'transport_user'@'localhost' IDENTIFIED BY 'transport_password';
GRANT ALL PRIVILEGES ON transport_tickets.* TO 'transport_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 2. Configuration de la base de données

### 2.1 Conception de la base de données

Créons le schéma de base de données :

```sql
-- Se connecter à la base de données
mysql -u transport_user -p transport_tickets

-- Table des utilisateurs
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des routes
CREATE TABLE routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    distance_km DECIMAL(8,2),
    duration_minutes INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des véhicules
CREATE TABLE vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type ENUM('BUS', 'TRAIN', 'METRO') NOT NULL,
    capacity INT NOT NULL,
    status ENUM('ACTIVE', 'MAINTENANCE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des voyages
CREATE TABLE trips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    available_seats INT NOT NULL,
    status ENUM('SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- Table des billets
CREATE TABLE tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    trip_id BIGINT NOT NULL,
    seat_number VARCHAR(10),
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    status ENUM('BOOKED', 'CONFIRMED', 'CANCELLED', 'USED') DEFAULT 'BOOKED',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (trip_id) REFERENCES trips(id)
);

-- Table des paiements
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('CARD', 'CASH', 'MOBILE_MONEY') NOT NULL,
    transaction_id VARCHAR(100),
    status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id)
);
```

---

## 3. Création du projet Java

### 3.1 Initialisation du projet avec Spring Boot

```bash
# Créer un nouveau répertoire pour le projet
mkdir transport-ticket-app
cd transport-ticket-app

# Créer la structure Maven
mkdir -p src/main/java/com/transport/ticketapp
mkdir -p src/main/resources
mkdir -p src/test/java/com/transport/ticketapp
```

### 3.2 Configuration du fichier pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.transport</groupId>
    <artifactId>ticket-app</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    
    <name>Transport Ticket Application</name>
    <description>Application de vente de billets de transport</description>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.0</version>
        <relativePath/>
    </parent>
    
    <properties>
        <java.version>11</java.version>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starter Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!-- Spring Boot Starter Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <!-- MySQL Connector -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Spring Boot Starter Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt</artifactId>
            <version>0.9.1</version>
        </dependency>
        
        <!-- Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- Spring Boot DevTools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        
        <!-- Spring Boot Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        
        <!-- H2 Database pour les tests -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## 4. Structure du projet

```
transport-ticket-app/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── transport/
│   │   │           └── ticketapp/
│   │   │               ├── TransportTicketApplication.java
│   │   │               ├── config/
│   │   │               │   ├── SecurityConfig.java
│   │   │               │   └── JwtConfig.java
│   │   │               ├── controller/
│   │   │               │   ├── AuthController.java
│   │   │               │   ├── UserController.java
│   │   │               │   ├── RouteController.java
│   │   │               │   ├── TripController.java
│   │   │               │   └── TicketController.java
│   │   │               ├── dto/
│   │   │               │   ├── UserDto.java
│   │   │               │   ├── LoginRequest.java
│   │   │               │   ├── TripDto.java
│   │   │               │   └── TicketDto.java
│   │   │               ├── entity/
│   │   │               │   ├── User.java
│   │   │               │   ├── Route.java
│   │   │               │   ├── Vehicle.java
│   │   │               │   ├── Trip.java
│   │   │               │   ├── Ticket.java
│   │   │               │   └── Payment.java
│   │   │               ├── repository/
│   │   │               │   ├── UserRepository.java
│   │   │               │   ├── RouteRepository.java
│   │   │               │   ├── VehicleRepository.java
│   │   │               │   ├── TripRepository.java
│   │   │               │   ├── TicketRepository.java
│   │   │               │   └── PaymentRepository.java
│   │   │               ├── service/
│   │   │               │   ├── UserService.java
│   │   │               │   ├── AuthService.java
│   │   │               │   ├── RouteService.java
│   │   │               │   ├── TripService.java
│   │   │               │   ├── TicketService.java
│   │   │               │   └── PaymentService.java
│   │   │               ├── security/
│   │   │               │   ├── JwtAuthenticationFilter.java
│   │   │               │   ├── JwtTokenProvider.java
│   │   │               │   └── UserPrincipal.java
│   │   │               └── exception/
│   │   │                   ├── ResourceNotFoundException.java
│   │   │                   └── GlobalExceptionHandler.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── data.sql
│   └── test/
│       └── java/
│           └── com/
│               └── transport/
│                   └── ticketapp/
├── pom.xml
└── README.md
```

---

## 5. Configuration Spring Boot

### 5.1 Fichier application.properties

```properties
# Configuration de la base de données
spring.datasource.url=jdbc:mysql://localhost:3306/transport_tickets?useSSL=false&serverTimezone=UTC
spring.datasource.username=transport_user
spring.datasource.password=transport_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Configuration JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# Configuration du serveur
server.port=8080
server.servlet.context-path=/api

# Configuration JWT
jwt.secret=mySecretKey
jwt.expiration=86400000

# Configuration des logs
logging.level.com.transport.ticketapp=DEBUG
logging.level.org.springframework.security=DEBUG
```

### 5.2 Classe principale de l'application

```java
package com.transport.ticketapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TransportTicketApplication {
    public static void main(String[] args) {
        SpringApplication.run(TransportTicketApplication.class, args);
    }
}
```

---

## 6. Modèles de données

### 6.1 Entité User

```java
package com.transport.ticketapp.entity;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 50)
    @Column(unique = true)
    private String username;
    
    @NotBlank
    @Email
    @Size(max = 100)
    @Column(unique = true)
    private String email;
    
    @NotBlank
    @Size(max = 255)
    private String password;
    
    @NotBlank
    @Size(max = 50)
    private String firstName;
    
    @NotBlank
    @Size(max = 50)
    private String lastName;
    
    @Size(max = 20)
    private String phone;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Ticket> tickets;
    
    // Constructeurs
    public User() {}
    
    public User(String username, String email, String password, 
                String firstName, String lastName) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<Ticket> getTickets() { return tickets; }
    public void setTickets(List<Ticket> tickets) { this.tickets = tickets; }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### 6.2 Entité Route

```java
package com.transport.ticketapp.entity;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "routes")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(length = 100)
    private String origin;
    
    @NotBlank
    @Column(length = 100)
    private String destination;
    
    @Column(name = "distance_km", precision = 8, scale = 2)
    private BigDecimal distanceKm;
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL)
    private List<Trip> trips;
    
    // Constructeurs
    public Route() {}
    
    public Route(String origin, String destination, 
                 BigDecimal distanceKm, Integer durationMinutes) {
        this.origin = origin;
        this.destination = destination;
        this.distanceKm = distanceKm;
        this.durationMinutes = durationMinutes;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    
    public BigDecimal getDistanceKm() { return distanceKm; }
    public void setDistanceKm(BigDecimal distanceKm) { this.distanceKm = distanceKm; }
    
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public List<Trip> getTrips() { return trips; }
    public void setTrips(List<Trip> trips) { this.trips = trips; }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

### 6.3 Entité Vehicle

```java
package com.transport.ticketapp.entity;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(name = "vehicle_number", unique = true, length = 20)
    private String vehicleNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type")
    private VehicleType vehicleType;
    
    @Positive
    private Integer capacity;
    
    @Enumerated(EnumType.STRING)
    private VehicleStatus status = VehicleStatus.ACTIVE;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private List<Trip> trips;
    
    // Enums
    public enum VehicleType {
        BUS, TRAIN, METRO
    }
    
    public enum VehicleStatus {
        ACTIVE, MAINTENANCE, INACTIVE
    }
    
    // Constructeurs
    public Vehicle() {}
    
    public Vehicle(String vehicleNumber, VehicleType vehicleType, Integer capacity) {
        this.vehicleNumber = vehicleNumber;
        this.vehicleType = vehicleType;
        this.capacity = capacity;
        this.status = VehicleStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }
    
    public VehicleType getVehicleType() { return vehicleType; }
    public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }
    
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    
    public VehicleStatus getStatus() { return status; }
    public void setStatus(VehicleStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public List<Trip> getTrips() { return trips; }
    public void setTrips(List<Trip> trips) { this.trips = trips; }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

### 6.4 Entité Trip

```java
package com.transport.ticketapp.entity;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "trips")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    @NotNull
    @Column(name = "departure_time")
    private LocalDateTime departureTime;
    
    @NotNull
    @Column(name = "arrival_time")
    private LocalDateTime arrivalTime;
    
    @NotNull
    @Positive
    @Column(precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "available_seats")
    private Integer availableSeats;
    
    @Enumerated(EnumType.STRING)
    private TripStatus status = TripStatus.SCHEDULED;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL)
    private List<Ticket> tickets;
    
    // Enum
    public enum TripStatus {
        SCHEDULED, ACTIVE, COMPLETED, CANCELLED
    }
    
    // Constructeurs
    public Trip() {}
    
    public Trip(Route route, Vehicle vehicle, LocalDateTime departureTime, 
                LocalDateTime arrivalTime, BigDecimal price) {
        this.route = route;
        this.vehicle = vehicle;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.price = price;
        this.availableSeats = vehicle.getCapacity();
        this.status = TripStatus.SCHEDULED;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Route getRoute() { return route; }
    public void setRoute(Route route) { this.route = route; }
    
    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }
    
    public LocalDateTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalDateTime departureTime) { this.departureTime = departureTime; }
    
    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public Integer getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
    
    public TripStatus getStatus() { return status; }
    public void setStatus(TripStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public List<Ticket> getTickets() { return tickets; }
    public void setTickets(List<Ticket> tickets) { this.tickets = tickets; }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

### 6.5 Entité Ticket

```java
package com.transport.ticketapp.entity;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;
    
    @Column(name = "seat_number", length = 10)
    private String seatNumber;
    
    @NotBlank
    @Column(name = "booking_reference", unique = true, length = 20)
    private String bookingReference;
    
    @Enumerated(EnumType.STRING)
    private TicketStatus status = TicketStatus.BOOKED;
    
    @Column(name = "booking_date")
    private LocalDateTime bookingDate;
    
    @NotNull
    @Positive
    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;
    
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL)
    private List<Payment> payments;
    
    // Enum
    public enum TicketStatus {
        BOOKED, CONFIRMED, CANCELLED, USED
    }
    
    // Constructeurs
    public Ticket() {}
    
    public Ticket(User user, Trip trip, String seatNumber, 
                  String bookingReference, BigDecimal totalPrice) {
        this.user = user;
        this.trip = trip;
        this.seatNumber = seatNumber;
        this.bookingReference = bookingReference;
        this.totalPrice = totalPrice;
        this.status = TicketStatus.BOOKED;
        this.bookingDate = LocalDateTime.now();
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }
    
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    
    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }
    
    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }
    
    public LocalDateTime getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }
    
    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
    
    public List<Payment> getPayments() { return payments; }
    public void setPayments(List<Payment> payments) { this.payments = payments; }
    
    @PrePersist
    protected void onCreate() {
        bookingDate = LocalDateTime.now();
    }
}
```

### 6.6 Entité Payment

```java
package com.transport.ticketapp.entity;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;
    
    @NotNull
    @Positive
    @Column(precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;
    
    @Column(name = "transaction_id", length = 100)
    private String transactionId;
    
    @Enumerated(EnumType.STRING)
    private PaymentStatus status = PaymentStatus.PENDING;
    
    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
    
    // Enums
    public enum PaymentMethod {
        CARD, CASH, MOBILE_MONEY
    }
    
    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, REFUNDED
    }
    
    // Constructeurs
    public Payment() {}
    
    public Payment(Ticket ticket, BigDecimal amount, PaymentMethod paymentMethod) {
        this.ticket = ticket;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = PaymentStatus.PENDING;
        this.paymentDate = LocalDateTime.now();
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Ticket getTicket() { return ticket; }
    public void setTicket(Ticket ticket) { this.ticket = ticket; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    
    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }
    
    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }
    
    @PrePersist
    protected void onCreate() {
        paymentDate = LocalDateTime.now();
    }
}
```

---

## 7. Repositories

### 7.1 UserRepository

```java
package com.transport.ticketapp.repository;

import com.transport.ticketapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
```

### 7.2 RouteRepository

```java
package com.transport.ticketapp.repository;

import com.transport.ticketapp.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findByOriginAndDestination(String origin, String destination);
    List<Route> findByOriginContainingIgnoreCase(String origin);
    List<Route> findByDestinationContainingIgnoreCase(String destination);
}
```

### 7.3 VehicleRepository

```java
package com.transport.ticketapp.repository;

import com.transport.ticketapp.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);
    List<Vehicle> findByVehicleType(Vehicle.VehicleType vehicleType);
    List<Vehicle> findByStatus(Vehicle.VehicleStatus status);
}
```

### 7.4 TripRepository

```java
package com.transport.ticketapp.repository;

import com.transport.ticketapp.entity.Trip;
import com.transport.ticketapp.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByRoute(Route route);
    List<Trip> findByStatus(Trip.TripStatus status);
    
    @Query("SELECT t FROM Trip t WHERE t.route.origin = :origin AND t.route.destination = :destination AND t.departureTime >= :departureTime")
    List<Trip> findAvailableTrips(@Param("origin") String origin, 
                                  @Param("destination") String destination, 
                                  @Param("departureTime") LocalDateTime departureTime);
    
    @Query("SELECT t FROM Trip t WHERE t.departureTime BETWEEN :startDate AND :endDate")
    List<Trip> findTripsByDateRange(@Param("startDate") LocalDateTime startDate, 
                                    @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM Trip t WHERE t.availableSeats > 0 AND t.status = 'SCHEDULED'")
    List<Trip> findAvailableTripsWithSeats();
}
```

### 7.5 TicketRepository

```java
package com.transport.ticketapp.repository;

import com.transport.ticketapp.entity.Ticket;
import com.transport.ticketapp.entity.User;
import com.transport.ticketapp.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByBookingReference(String bookingReference);
    List<Ticket> findByUser(User user);
    List<Ticket> findByTrip(Trip trip);
    List<Ticket> findByStatus(Ticket.TicketStatus status);
    List<Ticket> findByUserAndStatus(User user, Ticket.TicketStatus status);
}
```

### 7.6 PaymentRepository

```java
package com.transport.ticketapp.repository;

import com.transport.ticketapp.entity.Payment;
import com.transport.ticketapp.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByTicket(Ticket ticket);
    Optional<Payment> findByTransactionId(String transactionId);
    List<Payment> findByStatus(Payment.PaymentStatus status);
    List<Payment> findByPaymentMethod(Payment.PaymentMethod paymentMethod);
}
```

---

## 8. Services

### 8.1 UserService

```java
package com.transport.ticketapp.service;

import com.transport.ticketapp.entity.User;
import com.transport.ticketapp.repository.UserRepository;
import com.transport.ticketapp.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }
    
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
    
    public User createUser(User user) {
        // Vérifier si l'utilisateur existe déjà
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        
        // Encoder le mot de passe
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        user.setPhone(userDetails.getPhone());
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
    
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
```

### 8.2 TripService

```java
package com.transport.ticketapp.service;

import com.transport.ticketapp.entity.Trip;
import com.transport.ticketapp.entity.Route;
import com.transport.ticketapp.entity.Vehicle;
import com.transport.ticketapp.repository.TripRepository;
import com.transport.ticketapp.repository.RouteRepository;
import com.transport.ticketapp.repository.VehicleRepository;
import com.transport.ticketapp.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TripService {
    
    @Autowired
    private TripRepository tripRepository;
    
    @Autowired
    private RouteRepository routeRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }
    
    public Trip getTripById(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", id));
    }
    
    public List<Trip> searchTrips(String origin, String destination, LocalDateTime departureTime) {
        return tripRepository.findAvailableTrips(origin, destination, departureTime);
    }
    
    public List<Trip> getAvailableTrips() {
        return tripRepository.findAvailableTripsWithSeats();
    }
    
    public Trip createTrip(Trip trip) {
        // Vérifier que la route existe
        Route route = routeRepository.findById(trip.getRoute().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Route", "id", trip.getRoute().getId()));
        
        // Vérifier que le véhicule existe
        Vehicle vehicle = vehicleRepository.findById(trip.getVehicle().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", trip.getVehicle().getId()));
        
        // Initialiser les sièges disponibles
        trip.setAvailableSeats(vehicle.getCapacity());
        
        return tripRepository.save(trip);
    }
    
    public Trip updateTrip(Long id, Trip tripDetails) {
        Trip trip = getTripById(id);
        
        trip.setDepartureTime(tripDetails.getDepartureTime());
        trip.setArrivalTime(tripDetails.getArrivalTime());
        trip.setPrice(tripDetails.getPrice());
        trip.setStatus(tripDetails.getStatus());
        
        return tripRepository.save(trip);
    }
    
    public void deleteTrip(Long id) {
        Trip trip = getTripById(id);
        tripRepository.delete(trip);
    }
    
    public Trip bookSeat(Long tripId) {
        Trip trip = getTripById(tripId);
        
        if (trip.getAvailableSeats() <= 0) {
            throw new RuntimeException("No seats available for this trip");
        }
        
        trip.setAvailableSeats(trip.getAvailableSeats() - 1);
        return tripRepository.save(trip);
    }
    
    public Trip cancelSeat(Long tripId) {
        Trip trip = getTripById(tripId);
        
        if (trip.getAvailableSeats() < trip.getVehicle().getCapacity()) {
            trip.setAvailableSeats(trip.getAvailableSeats() + 1);
            return tripRepository.save(trip);
        }
        
        return trip;
    }
}
```

### 8.3 TicketService

```java
package com.transport.ticketapp.service;

import com.transport.ticketapp.entity.Ticket;
import com.transport.ticketapp.entity.User;
import com.transport.ticketapp.entity.Trip;
import com.transport.ticketapp.repository.TicketRepository;
import com.transport.ticketapp.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private TripService tripService;
    
    @Autowired
    private UserService userService;
    
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }
    
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));
    }
    
    public Ticket getTicketByBookingReference(String bookingReference) {
        return ticketRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "bookingReference", bookingReference));
    }
    
    public List<Ticket> getTicketsByUser(Long userId) {
        User user = userService.getUserById(userId);
        return ticketRepository.findByUser(user);
    }
    
    public Ticket bookTicket(Long userId, Long tripId, String seatNumber) {
        User user = userService.getUserById(userId);
        Trip trip = tripService.getTripById(tripId);
        
        // Vérifier la disponibilité des sièges
        if (trip.getAvailableSeats() <= 0) {
            throw new RuntimeException("No seats available for this trip");
        }
        
        // Générer une référence de réservation unique
        String bookingReference = generateBookingReference();
        
        // Créer le billet
        Ticket ticket = new Ticket(user, trip, seatNumber, bookingReference, trip.getPrice());
        
        // Réserver le siège
        tripService.bookSeat(tripId);
        
        return ticketRepository.save(ticket);
    }
    
    public Ticket confirmTicket(Long ticketId) {
        Ticket ticket = getTicketById(ticketId);
        ticket.setStatus(Ticket.TicketStatus.CONFIRMED);
        return ticketRepository.save(ticket);
    }
    
    public Ticket cancelTicket(Long ticketId) {
        Ticket ticket = getTicketById(ticketId);
        
        if (ticket.getStatus() == Ticket.TicketStatus.USED) {
            throw new RuntimeException("Cannot cancel a used ticket");
        }
        
        ticket.setStatus(Ticket.TicketStatus.CANCELLED);
        
        // Libérer le siège
        tripService.cancelSeat(ticket.getTrip().getId());
        
        return ticketRepository.save(ticket);
    }
    
    public Ticket useTicket(Long ticketId) {
        Ticket ticket = getTicketById(ticketId);
        
        if (ticket.getStatus() != Ticket.TicketStatus.CONFIRMED) {
            throw new RuntimeException("Ticket must be confirmed before use");
        }
        
        ticket.setStatus(Ticket.TicketStatus.USED);
        return ticketRepository.save(ticket);
    }
    
    private String generateBookingReference() {
        return "BK" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
```

---

## 9. Contrôleurs REST

### 9.1 AuthController

```java
package com.transport.ticketapp.controller;

import com.transport.ticketapp.dto.LoginRequest;
import com.transport.ticketapp.dto.UserDto;
import com.transport.ticketapp.entity.User;
import com.transport.ticketapp.service.UserService;
import com.transport.ticketapp.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );
        
        String jwt = tokenProvider.generateToken(authentication);
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("type", "Bearer");
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDto userDto) {
        User user = new User(
                userDto.getUsername(),
                userDto.getEmail(),
                userDto.getPassword(),
                userDto.getFirstName(),
                userDto.getLastName()
        );
        
        user.setPhone(userDto.getPhone());
        
        User result = userService.createUser(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("userId", result.getId());
        
        return ResponseEntity.ok(response);
    }
}
```

### 9.2 TripController

```java
package com.transport.ticketapp.controller;

import com.transport.ticketapp.entity.Trip;
import com.transport.ticketapp.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/trips")
@CrossOrigin(origins = "*")
public class TripController {
    
    @Autowired
    private TripService tripService;
    
    @GetMapping
    public List<Trip> getAllTrips() {
        return tripService.getAllTrips();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        Trip trip = tripService.getTripById(id);
        return ResponseEntity.ok(trip);
    }
    
    @GetMapping("/search")
    public List<Trip> searchTrips(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime departureTime) {
        return tripService.searchTrips(origin, destination, departureTime);
    }
    
    @GetMapping("/available")
    public List<Trip> getAvailableTrips() {
        return tripService.getAvailableTrips();
    }
    
    @PostMapping
    public Trip createTrip(@Valid @RequestBody Trip trip) {
        return tripService.createTrip(trip);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(@PathVariable Long id, @Valid @RequestBody Trip tripDetails) {
        Trip updatedTrip = tripService.updateTrip(id, tripDetails);
        return ResponseEntity.ok(updatedTrip);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.ok().build();
    }
}
```

### 9.3 TicketController

```java
package com.transport.ticketapp.controller;

import com.transport.ticketapp.entity.Ticket;
import com.transport.ticketapp.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tickets")
@CrossOrigin(origins = "*")
public class TicketController {
    
    @Autowired
    private TicketService ticketService;
    
    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        Ticket ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ticket);
    }
    
    @GetMapping("/booking/{bookingReference}")
    public ResponseEntity<Ticket> getTicketByBookingReference(@PathVariable String bookingReference) {
        Ticket ticket = ticketService.getTicketByBookingReference(bookingReference);
        return ResponseEntity.ok(ticket);
    }
    
    @GetMapping("/user/{userId}")
    public List<Ticket> getTicketsByUser(@PathVariable Long userId) {
        return ticketService.getTicketsByUser(userId);
    }
    
    @PostMapping("/book")
    public ResponseEntity<Ticket> bookTicket(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        Long tripId = Long.valueOf(request.get("tripId").toString());
        String seatNumber = request.get("seatNumber").toString();
        
        Ticket ticket = ticketService.bookTicket(userId, tripId, seatNumber);
        return ResponseEntity.ok(ticket);
    }
    
    @PutMapping("/{id}/confirm")
    public ResponseEntity<Ticket> confirmTicket(@PathVariable Long id) {
        Ticket ticket = ticketService.confirmTicket(id);
        return ResponseEntity.ok(ticket);
    }
    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Ticket> cancelTicket(@PathVariable Long id) {
        Ticket ticket = ticketService.cancelTicket(id);
        return ResponseEntity.ok(ticket);
    }
    
    @PutMapping("/{id}/use")
    public ResponseEntity<Ticket> useTicket(@PathVariable Long id) {
        Ticket ticket = ticketService.useTicket(id);
        return ResponseEntity.ok(ticket);
    }
}
```

---

## 10. Tests

### 10.1 Configuration des tests

Créer `src/test/resources/application-test.properties` :

```properties
# Configuration H2 pour les tests
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password

# Configuration JPA pour les tests
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# Configuration JWT pour les tests
jwt.secret=testSecret
jwt.expiration=86400000
```

### 10.2 Test du UserService

```java
package com.transport.ticketapp.service;

import com.transport.ticketapp.entity.User;
import com.transport.ticketapp.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class UserServiceTest {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private User testUser;
    
    @BeforeEach
    void setUp() {
        testUser = new User("testuser", "test@example.com", "password123", "Test", "User");
    }
    
    @Test
    void testCreateUser() {
        User createdUser = userService.createUser(testUser);
        
        assertNotNull(createdUser.getId());
        assertEquals("testuser", createdUser.getUsername());
        assertEquals("test@example.com", createdUser.getEmail());
        assertTrue(passwordEncoder.matches("password123", createdUser.getPassword()));
    }
    
    @Test
    void testGetUserById() {
        User savedUser = userRepository.save(testUser);
        User foundUser = userService.getUserById(savedUser.getId());
        
        assertEquals(savedUser.getId(), foundUser.getId());
        assertEquals(savedUser.getUsername(), foundUser.getUsername());
    }
    
    @Test
    void testUpdateUser() {
        User savedUser = userRepository.save(testUser);
        
        User updateData = new User();
        updateData.setFirstName("Updated");
        updateData.setLastName("Name");
        updateData.setEmail("updated@example.com");
        
        User updatedUser = userService.updateUser(savedUser.getId(), updateData);
        
        assertEquals("Updated", updatedUser.getFirstName());
        assertEquals("Name", updatedUser.getLastName());
        assertEquals("updated@example.com", updatedUser.getEmail());
    }
}
```

---

## 11. Déploiement

### 11.1 Compilation et packaging

```bash
# Compiler le projet
mvn clean compile

# Exécuter les tests
mvn test

# Créer le JAR
mvn clean package

# Ou ignorer les tests pour un build plus rapide
mvn clean package -DskipTests
```

### 11.2 Exécution de l'application

```bash
# Exécuter avec Maven
mvn spring-boot:run

# Ou exécuter le JAR directement
java -jar target/ticket-app-1.0.0.jar

# Avec des variables d'environnement
java -jar target/ticket-app-1.0.0.jar --spring.profiles.active=prod
```

### 11.3 Configuration pour la production

Créer `src/main/resources/application-prod.properties` :

```properties
# Configuration de production
server.port=8080

# Configuration de la base de données de production
spring.datasource.url=jdbc:mysql://localhost:3306/transport_tickets_prod
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

# Configuration JPA pour la production
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# Configuration des logs
logging.level.com.transport.ticketapp=INFO
logging.file.name=transport-app.log

# Configuration JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000
```

### 11.4 Script de déploiement

Créer `deploy.sh` :

```bash
#!/bin/bash

echo "Déploiement de l'application Transport Ticket..."

# Arrêter l'application si elle est en cours d'exécution
pkill -f "ticket-app"

# Sauvegarder la base de données
mysqldump -u transport_user -p transport_tickets > backup_$(date +%Y%m%d_%H%M%S).sql

# Compiler et packager l'application
mvn clean package -DskipTests

# Créer le répertoire de déploiement
mkdir -p /opt/transport-app

# Copier le JAR
cp target/ticket-app-1.0.0.jar /opt/transport-app/

# Copier les fichiers de configuration
cp application-prod.properties /opt/transport-app/

# Définir les variables d'environnement
export DB_USERNAME=transport_user
export DB_PASSWORD=transport_password
export JWT_SECRET=myProductionSecretKey

# Démarrer l'application
nohup java -jar /opt/transport-app/ticket-app-1.0.0.jar --spring.profiles.active=prod > /opt/transport-app/app.log 2>&1 &

echo "Application déployée avec succès!"
echo "Logs disponibles dans /opt/transport-app/app.log"
```

### 11.5 Configuration avec Docker

Créer `Dockerfile` :

```dockerfile
FROM openjdk:11-jre-slim

WORKDIR /app

COPY target/ticket-app-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

Créer `docker-compose.yml` :

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: transport_tickets
      MYSQL_USER: transport_user
      MYSQL_PASSWORD: transport_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  app:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - mysql
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_USERNAME=transport_user
      - DB_PASSWORD=transport_password
      - JWT_SECRET=myProductionSecretKey
    volumes:
      - ./logs:/app/logs

volumes:
  mysql_data:
```

### 11.6 Commandes de déploiement Docker

```bash
# Construire et démarrer les services
docker-compose up -d

# Voir les logs
docker-compose logs -f app

# Arrêter les services
docker-compose down

# Reconstruire l'application
docker-compose build app
docker-compose up -d app
```

---

## 12. Tests de l'API

### 12.1 Tests avec curl

```bash
# Enregistrer un utilisateur
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890"
  }'

# Se connecter
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'

# Rechercher des voyages
curl -X GET "http://localhost:8080/api/trips/search?origin=Paris&destination=Lyon&departureTime=2024-01-15T10:00:00" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Réserver un billet
curl -X POST http://localhost:8080/api/tickets/book \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": 1,
    "tripId": 1,
    "seatNumber": "A1"
  }'
```

---

## Conclusion

Ce tutoriel vous a guidé à travers la création complète d'une application de vente de billets de transport avec Java et MySQL. Voici les points clés couverts :

1. **Configuration de l'environnement** : Installation de Java, Maven, MySQL
2. **Architecture Spring Boot** : Structure du projet, configuration, dépendances
3. **Modélisation des données** : Entités JPA, relations, contraintes
4. **Couche d'accès aux données** : Repositories Spring Data JPA
5. **Logique métier** : Services avec gestion des transactions
6. **API REST** : Contrôleurs avec endpoints sécurisés
7. **Sécurité** : Authentification JWT, autorisation
8. **Tests** : Tests unitaires et d'intégration
9. **Déploiement** : Configuration de production, Docker, scripts

### Prochaines étapes possibles :

- Ajouter une interface utilisateur (React, Angular, ou Vue.js)
- Implémenter des notifications en temps réel
- Ajouter un système de paiement
- Mettre en place une architecture microservices
- Ajouter de la surveillance et du monitoring

Cette application constitue une base solide que vous pouvez étendre selon vos besoins spécifiques.