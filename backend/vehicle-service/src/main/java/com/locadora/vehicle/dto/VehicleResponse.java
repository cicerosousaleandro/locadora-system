package com.locadora.vehicle.dto;

import com.locadora.vehicle.entity.VehicleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class VehicleResponse {
    private Long id;
    private String brand;
    private String model;
    private String year;
    private String plate;
    private String chassi;
    private String color;
    private Integer seats;
    private Boolean airConditioning;
    private Boolean automaticTransmission;
    private String imageUrl;
    private VehicleStatus status;
    private Double dailyRate;
    private Long categoryId;
    private String categoryName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}