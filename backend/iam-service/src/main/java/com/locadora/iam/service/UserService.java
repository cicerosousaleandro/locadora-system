package com.locadora.iam.service;

import com.locadora.iam.dto.ChangePasswordRequest;
import com.locadora.iam.dto.LoginRequest;
import com.locadora.iam.dto.LoginResponse;
import com.locadora.iam.dto.UserCreateRequest;
import com.locadora.iam.dto.UserResponse;
import com.locadora.iam.dto.UserUpdateRequest;
import com.locadora.iam.entity.Role;
import com.locadora.iam.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    User createUser(User user);
    Optional<User> findByUsername(String username);

    Role createRole(Role role);
    Optional<Role> findByName(String name);

    UserResponse createUserWithRoles(UserCreateRequest request);
    List<UserResponse> getAllUsers();
    Optional<UserResponse> getUserById(Long id);

    void changePassword(String username, ChangePasswordRequest request);
    void deleteUserById(Long id);
    UserResponse updateUser(Long id, UserUpdateRequest request);
}