package com.locadora.vehicle.dto;

import com.locadora.vehicle.entity.VehicleStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleRequest {
    @NotBlank(message = "Marca é obrigatória")
    @Size(max = 100)
    private String brand;

    @NotBlank(message = "Modelo é obrigatório")
    @Size(max = 100)
    private String model;

    @NotBlank(message = "Ano é obrigatório")
    @Size(min = 4, max = 10)
    private String year;

    @NotBlank(message = "Placa é obrigatória")
    @Size(min = 7, max = 20)
    private String plate;

    @NotBlank(message = "Chassi é obrigatório")
    @Size(min = 17, max = 17, message = "Chassi deve ter exatamente 17 caracteres")
    private String chassi;

    @NotBlank(message = "Cor é obrigatória")
    private String color;

    @NotNull(message = "Número de assentos é obrigatório")
    @Min(value = 1, message = "Veículo deve ter pelo menos 1 assento")
    private Integer seats;

    @NotNull(message = "Ar condicionado é obrigatório")
    private Boolean airConditioning;

    @NotNull(message = "Transmissão automática é obrigatória")
    private Boolean automaticTransmission;

    private String imageUrl;

    @NotNull(message = "Status é obrigatório")
    private VehicleStatus status;

    @NotNull(message = "Taxa diária é obrigatória")
    @Min(value = 0, message = "Taxa diária deve ser positiva")
    private Double dailyRate;

    @NotNull(message = "ID da Categoria é obrigatório")
    private Long categoryId;
}