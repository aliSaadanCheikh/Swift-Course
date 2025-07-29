package com.transport.ticketapp.service;

import com.transport.ticketapp.dto.JwtAuthenticationResponse;
import com.transport.ticketapp.dto.LoginDto;
import com.transport.ticketapp.dto.UserRegistrationDto;
import com.transport.ticketapp.entity.Role;
import com.transport.ticketapp.entity.User;
import com.transport.ticketapp.exception.BadRequestException;
import com.transport.ticketapp.repository.RoleRepository;
import com.transport.ticketapp.repository.UserRepository;
import com.transport.ticketapp.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    
    @Transactional
    public String registerUser(UserRegistrationDto registrationDto) {
        if (userRepository.existsByUsername(registrationDto.getUsername())) {
            throw new BadRequestException("Ce nom d'utilisateur est déjà pris !");
        }
        
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new BadRequestException("Cette adresse email est déjà utilisée !");
        }
        
        // Créer un nouvel utilisateur
        User user = new User();
        user.setUsername(registrationDto.getUsername());
        user.setEmail(registrationDto.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setFirstName(registrationDto.getFirstName());
        user.setLastName(registrationDto.getLastName());
        user.setPhoneNumber(registrationDto.getPhoneNumber());
        
        Role userRole = roleRepository.findByName(Role.RoleName.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Rôle utilisateur non trouvé."));
        
        user.setRoles(Collections.singleton(userRole));
        
        User savedUser = userRepository.save(user);
        log.info("Nouvel utilisateur enregistré : {}", savedUser.getUsername());
        
        return "Utilisateur enregistré avec succès";
    }
    
    public JwtAuthenticationResponse authenticateUser(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsernameOrEmail(),
                        loginDto.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String jwt = tokenProvider.generateToken(authentication);
        
        User user = userRepository.findByUsernameOrEmail(
                loginDto.getUsernameOrEmail(), 
                loginDto.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        return new JwtAuthenticationResponse(jwt, user.getId(), user.getUsername(), user.getEmail());
    }
}