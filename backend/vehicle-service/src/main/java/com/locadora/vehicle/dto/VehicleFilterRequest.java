package com.locadora.vehicle.dto;

import com.locadora.vehicle.entity.VehicleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleFilterRequest {
    private String brand;
    private String model;
    private VehicleStatus status;
    private Long categoryId;
    private Double minRate;
    private Double maxRate;
}