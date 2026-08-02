package com.locadora.rental.dto;

import java.math.BigDecimal;

public record VehicleDTO(
        Long id,
        String model,
        String licensePlate,
        BigDecimal dailyRate,
        String status
) {}