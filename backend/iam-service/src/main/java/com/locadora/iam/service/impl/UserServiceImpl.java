package com.locadora.iam.service.impl;

import com.locadora.iam.dto.UserCreateRequest;
import com.locadora.iam.dto.UserResponse;
import com.locadora.iam.entity.Role;
import com.locadora.iam.entity.User;
import com.locadora.iam.repository.RoleRepository;
import com.locadora.iam.repository.UserRepository;
import com.locadora.iam.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    @Transactional
    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public Optional<Role> findByName(String name) {
        return roleRepository.findByName(name);
    }

    @Override
    @Transactional
    public UserResponse createUserWithRoles(UserCreateRequest request) {
        // Verificar se username já existe
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username já está em uso: " + request.getUsername());
        }

        // Verificar se email já existe
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email já está em uso: " + request.getEmail());
        }

        // Criar usuário
        User user = User.builder()
                .username(request.getUsername())
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .build();

        // Adicionar roles se fornecidas
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            Set<Role> roles = request.getRoles().stream()
                    .map(roleName -> roleRepository.findByName(roleName)
                            .orElseThrow(() -> new RuntimeException("Role não encontrada: " + roleName)))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        } else {
            // Role padrão: ROLE_CAIXA
            Role defaultRole = roleRepository.findByName(Role.ROLE_CAIXA)
                    .orElseThrow(() -> new RuntimeException("Role padrão ROLE_CAIXA não encontrada"));
            user.setRoles(Set.of(defaultRole));
        }

        User savedUser = userRepository.save(user);

        // Converter para DTO de resposta
        return convertToResponse(savedUser);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<UserResponse> getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToResponse);
    }

    // Método auxiliar para converter Entity → DTO
    private UserResponse convertToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .enabled(user.getEnabled())
                .roles(user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }
}