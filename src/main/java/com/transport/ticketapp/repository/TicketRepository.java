package com.transport.ticketapp.repository;

import com.transport.ticketapp.entity.Ticket;
import com.transport.ticketapp.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    Optional<Ticket> findByTicketNumber(String ticketNumber);
    
    List<Ticket> findByUser(User user);
    
    Page<Ticket> findByUser(User user, Pageable pageable);
    
    List<Ticket> findByUserAndStatus(User user, Ticket.TicketStatus status);
    
    @Query("SELECT t FROM Ticket t WHERE t.user.id = :userId AND t.status = :status")
    List<Ticket> findByUserIdAndStatus(@Param("userId") Long userId, 
                                      @Param("status") Ticket.TicketStatus status);
    
    List<Ticket> findByTravelDate(LocalDate travelDate);
    
    @Query("SELECT t FROM Ticket t WHERE t.travelDate = :travelDate AND t.status = :status")
    List<Ticket> findByTravelDateAndStatus(@Param("travelDate") LocalDate travelDate,
                                          @Param("status") Ticket.TicketStatus status);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.route.id = :routeId AND t.travelDate = :travelDate " +
           "AND t.status IN ('CONFIRMED', 'USED')")
    Long countConfirmedTicketsByRouteAndDate(@Param("routeId") Long routeId, 
                                           @Param("travelDate") LocalDate travelDate);
    
    Boolean existsByTicketNumber(String ticketNumber);
}