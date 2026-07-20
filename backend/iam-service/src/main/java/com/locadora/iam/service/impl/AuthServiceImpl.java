package com.locadora.iam.service.impl;

import com.locadora.iam.dto.LoginRequest;
import com.locadora.iam.dto.LoginResponse;
import com.locadora.iam.entity.User;
import com.locadora.iam.repository.UserRepository;
import com.locadora.iam.security.JwtService;
import com.locadora.iam.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public LoginResponse authenticate(LoginRequest request) {
        // Buscar usuário no banco
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Validar senha
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Senha inválida");
        }

        // Verificar se usuário está ativo
        if (!user.getEnabled()) {
            throw new RuntimeException("Usuário desativado");
        }

        // Gerar claims (informações adicionais no token)
        HashMap<String, Object> claims = new HashMap<>();
        claims.put("roles", user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toList()));

        // Gerar token JWT
        String token = jwtService.generateToken(user.getUsername(), claims);

        // Retornar resposta
        return LoginResponse.builder()
                .token(token)
                .username(user.getUsername())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName())
                        .collect(Collectors.toList()))
                .build();
    }
}