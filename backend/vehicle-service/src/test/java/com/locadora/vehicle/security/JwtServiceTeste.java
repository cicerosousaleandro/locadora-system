package com.locadora.vehicle.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    private JwtService jwtService;
    private SecretKey secretKey;
    private String tokenValido;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();


        String secret = "locadora-system-secret-key-min-32-chars";
        ReflectionTestUtils.setField(jwtService, "secret", secret);
        ReflectionTestUtils.setField(jwtService, "expiration", 86400000L);

        secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));


        tokenValido = Jwts.builder()
                .setSubject("admin")
                .claim("roles", List.of("ROLE_ADMIN", "ROLE_CAIXA"))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(secretKey)
                .compact();
    }

    @Test
    @DisplayName("Deve extrair username do token válido")
    void deveExtrairUsername() {
        String username = jwtService.extractUsername(tokenValido);
        assertEquals("admin", username);
    }

    @Test
    @DisplayName("Deve validar token válido como true")
    void deveValidarTokenValido() {
        assertTrue(jwtService.validateToken(tokenValido));
    }

    @Test
    @DisplayName("Deve invalidar token com assinatura errada")
    void deveInvalidarTokenComAssinaturaErrada() {

        String outraChave = "outra-chave-secreta-diferente-min-32-char";
        SecretKey outraKey = Keys.hmacShaKeyFor(outraChave.getBytes(StandardCharsets.UTF_8));

        String tokenInvalido = Jwts.builder()
                .setSubject("admin")
                .signWith(outraKey)
                .compact();

        assertFalse(jwtService.validateToken(tokenInvalido));
    }

    @Test
    @DisplayName("Deve invalidar token expirado")
    void deveInvalidarTokenExpirado() {
        String tokenExpirado = Jwts.builder()
                .setSubject("admin")
                .setIssuedAt(new Date(System.currentTimeMillis() - 100000000))
                .setExpiration(new Date(System.currentTimeMillis() - 1000))  // Expirou no passado
                .signWith(secretKey)
                .compact();

        assertFalse(jwtService.validateToken(tokenExpirado));
    }

    @Test
    @DisplayName("Deve invalidar token malformado")
    void deveInvalidarTokenMalformado() {
        assertFalse(jwtService.validateToken("token-invalido-abc"));
    }

    @Test
    @DisplayName("Deve extrair claims do token")
    void deveExtrairClaims() {
        var claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(tokenValido)
                .getPayload();

        assertEquals("admin", claims.getSubject());
        assertEquals(List.of("ROLE_ADMIN", "ROLE_CAIXA"), claims.get("roles", List.class));
    }
}