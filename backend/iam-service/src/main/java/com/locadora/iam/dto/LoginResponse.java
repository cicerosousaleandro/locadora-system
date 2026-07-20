package com.locadora.iam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String username;
    private List<String> roles;
}