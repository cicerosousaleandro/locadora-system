package com.locadora.vehicle.service;

import com.locadora.vehicle.dto.VehicleFilterRequest;
import com.locadora.vehicle.dto.VehicleRequest;
import com.locadora.vehicle.dto.VehicleResponse;

import java.util.List;
import java.util.Optional;

public interface VehicleService {
    VehicleResponse createVehicle(VehicleRequest request);
    List<VehicleResponse> getAllVehicles();
    List<VehicleResponse> getVehiclesWithFilters(VehicleFilterRequest filters);
    Optional<VehicleResponse> getVehicleById(Long id);
    VehicleResponse updateVehicle(Long id, VehicleRequest request);
    void deleteVehicle(Long id);
}