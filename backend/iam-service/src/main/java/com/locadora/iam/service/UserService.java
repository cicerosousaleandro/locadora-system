package com.locadora.iam.service;

import com.locadora.iam.entity.Role;
import com.locadora.iam.entity.User;
import java.util.Optional;

public interface UserService {

    User createUser(User user);
    Optional<User> findByUsername(String username);
    Role createRole(Role role);
    Optional<Role> findByName(String name);
}