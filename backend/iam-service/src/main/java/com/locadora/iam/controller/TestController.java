package com.locadora.iam.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/teste")
    public ResponseEntity<Map<String, Object>> teste(Authentication authentication) {
        // O Spring Security injeta automaticamente o objeto Authentication
        // se o token JWT for válido

        return ResponseEntity.ok(Map.of(
                "mensagem", "✅ Acesso autorizado! Você está autenticado.",
                "usuario", authentication.getName(),
                "autoridades", authentication.getAuthorities().toString()
        ));
    }
}