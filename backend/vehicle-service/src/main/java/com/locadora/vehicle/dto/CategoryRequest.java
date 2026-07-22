package com.locadora.vehicle.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {
    @NotBlank(message = "Nome da categoria é obrigatório")
    @Size(max = 50, message = "Nome deve ter no máximo 50 caracteres")
    private String name;

    @Size(max = 200, message = "Descrição deve ter no máximo 200 caracteres")
    private String description;

    @Min(value = 0, message = "Taxa diária deve ser positiva")
    private Double dailyRate;
}