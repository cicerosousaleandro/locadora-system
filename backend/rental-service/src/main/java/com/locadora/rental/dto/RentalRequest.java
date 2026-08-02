package com.locadora.rental.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record RentalRequest(
        @NotNull(message = "O ID do usuário é obrigatório")
        Long userId,

        @NotNull(message = "O ID do veículo é obrigatório")
        Long vehicleId,

        @NotNull(message = "A data de início é obrigatória")
        @Future(message = "A data de início deve ser no futuro")
        LocalDateTime startDate,

        @NotNull(message = "A data de fim é obrigatória")
        @Future(message = "A data de fim deve ser no futuro")
        LocalDateTime endDate
) {}