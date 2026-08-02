package com.locadora.rental.dto;

import com.locadora.rental.enums.RentalStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RentalResponse(
        Long id,
        Long userId,
        Long vehicleId,
        LocalDateTime startDate,
        LocalDateTime endDate,
        BigDecimal totalValue,
        RentalStatus status,
        LocalDateTime createdAt
) {}