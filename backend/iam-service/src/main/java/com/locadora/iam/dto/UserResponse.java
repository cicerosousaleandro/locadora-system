package com.locadora.iam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String username;
    private String name;
    private String email;
    private Boolean enabled;
    private Set<String> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;

    // Note: SEM senha! Nunca expomos senhas em respostas.
}