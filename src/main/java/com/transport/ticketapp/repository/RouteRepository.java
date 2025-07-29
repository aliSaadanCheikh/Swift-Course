package com.transport.ticketapp.repository;

import com.transport.ticketapp.entity.Route;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    
    List<Route> findByActiveTrue();
    
    Page<Route> findByActiveTrue(Pageable pageable);
    
    List<Route> findByDepartureCityAndArrivalCityAndActiveTrue(
        String departureCity, String arrivalCity);
    
    @Query("SELECT r FROM Route r WHERE r.departureCity = :departureCity " +
           "AND r.arrivalCity = :arrivalCity AND r.active = true " +
           "AND r.availableSeats > 0")
    List<Route> findAvailableRoutes(
        @Param("departureCity") String departureCity,
        @Param("arrivalCity") String arrivalCity);
    
    List<Route> findByTransportTypeAndActiveTrue(Route.TransportType transportType);
    
    @Query("SELECT r FROM Route r WHERE r.departureTime >= :fromTime " +
           "AND r.departureTime <= :toTime AND r.active = true")
    List<Route> findByDepartureTimeBetween(
        @Param("fromTime") LocalTime fromTime,
        @Param("toTime") LocalTime toTime);
}