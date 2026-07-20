package com.locadora.iam.config;

import com.locadora.iam.entity.Role;
import com.locadora.iam.entity.User;
import com.locadora.iam.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserService userService;

    @Override
    public void run(String... args) throws Exception {
        log.info("🚀 Iniciando seed de dados iniciais...");

        Role roleAdmin = getOrCreateRole(Role.ROLE_ADMIN, "Administrador do Sistema");
        Role roleCaixa = getOrCreateRole(Role.ROLE_CAIXA, "Operador de Caixa");

        if (userService.findByUsername("admin").isEmpty()) {
            User admin = User.builder()
                    .username("admin")
                    .name("Administrador Mestre")
                    .email("admin@locadora.com")
                    .password("admin123")
                    .roles(Set.of(roleAdmin, roleCaixa))
                    .enabled(true)
                    .build();

            userService.createUser(admin);
            log.info("✅ Usuário 'admin' criado com sucesso!");
        } else {
            log.info("ℹ️ Usuário 'admin' já existe.");
        }
    }

    private Role getOrCreateRole(String name, String description) {
        return userService.findByName(name).orElseGet(() -> {
            Role newRole = Role.builder()
                    .name(name)
                    .description(description)
                    .build();
            userService.createRole(newRole);
            log.info("✅ Role '{}' criada.", name);
            return newRole;
        });
    }
}