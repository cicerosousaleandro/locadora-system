package com.locadora.iam.service;

import com.locadora.iam.dto.LoginRequest;
import com.locadora.iam.dto.LoginResponse;

public interface AuthService {
    LoginResponse authenticate(LoginRequest request);
}