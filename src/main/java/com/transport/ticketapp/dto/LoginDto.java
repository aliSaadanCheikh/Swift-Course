package com.transport.ticketapp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginDto {
    
    @NotBlank(message = "Le nom d'utilisateur ou email est obligatoire")
    private String usernameOrEmail;
    
    @NotBlank(message = "Le mot de passe est obligatoire")
    private String password;
}