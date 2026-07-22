package com.locadora.vehicle.service.impl;

import com.locadora.vehicle.dto.VehicleFilterRequest;
import com.locadora.vehicle.dto.VehicleRequest;
import com.locadora.vehicle.dto.VehicleResponse;
import com.locadora.vehicle.entity.Category;
import com.locadora.vehicle.entity.Vehicle;
import com.locadora.vehicle.repository.CategoryRepository;
import com.locadora.vehicle.repository.VehicleRepository;
import com.locadora.vehicle.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public VehicleResponse createVehicle(VehicleRequest request) {
        if (vehicleRepository.existsByPlate(request.getPlate())) {
            throw new RuntimeException("Placa já cadastrada: " + request.getPlate());
        }

        if (vehicleRepository.existsByChassi(request.getChassi())) {
            throw new RuntimeException("Chassi já cadastrado: " + request.getChassi());
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada: " + request.getCategoryId()));

        Vehicle vehicle = Vehicle.builder()
                .brand(request.getBrand())
                .model(request.getModel())
                .year(request.getYear())
                .plate(request.getPlate())
                .chassi(request.getChassi())
                .color(request.getColor())
                .seats(request.getSeats())
                .airConditioning(request.getAirConditioning())
                .automaticTransmission(request.getAutomaticTransmission())
                .imageUrl(request.getImageUrl())
                .status(request.getStatus())
                .dailyRate(request.getDailyRate())
                .category(category)
                .build();

        Vehicle saved = vehicleRepository.save(vehicle);
        return convertToResponse(saved);
    }

    @Override
    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<VehicleResponse> getVehiclesWithFilters(VehicleFilterRequest filters) {
        return vehicleRepository.findWithFilters(
                filters.getBrand(),
                filters.getModel(),
                filters.getStatus(),
                filters.getCategoryId(),
                filters.getMinRate(),
                filters.getMaxRate()
        ).stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public Optional<VehicleResponse> getVehicleById(Long id) {
        return vehicleRepository.findById(id).map(this::convertToResponse);
    }

    @Override
    @Transactional
    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado: " + id));

        // Verificar placa/chassi apenas se mudaram
        if (!vehicle.getPlate().equals(request.getPlate()) && vehicleRepository.existsByPlate(request.getPlate())) {
            throw new RuntimeException("Placa já cadastrada: " + request.getPlate());
        }
        if (!vehicle.getChassi().equals(request.getChassi()) && vehicleRepository.existsByChassi(request.getChassi())) {
            throw new RuntimeException("Chassi já cadastrado: " + request.getChassi());
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada: " + request.getCategoryId()));

        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        vehicle.setPlate(request.getPlate());
        vehicle.setChassi(request.getChassi());
        vehicle.setColor(request.getColor());
        vehicle.setSeats(request.getSeats());
        vehicle.setAirConditioning(request.getAirConditioning());
        vehicle.setAutomaticTransmission(request.getAutomaticTransmission());
        vehicle.setImageUrl(request.getImageUrl());
        vehicle.setStatus(request.getStatus());
        vehicle.setDailyRate(request.getDailyRate());
        vehicle.setCategory(category);

        Vehicle updated = vehicleRepository.save(vehicle);
        return convertToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado: " + id));
        vehicleRepository.delete(vehicle);
    }

    private VehicleResponse convertToResponse(Vehicle vehicle) {
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .year(vehicle.getYear())
                .plate(vehicle.getPlate())
                .chassi(vehicle.getChassi())
                .color(vehicle.getColor())
                .seats(vehicle.getSeats())
                .airConditioning(vehicle.getAirConditioning())
                .automaticTransmission(vehicle.getAutomaticTransmission())
                .imageUrl(vehicle.getImageUrl())
                .status(vehicle.getStatus())
                .dailyRate(vehicle.getDailyRate())
                .categoryId(vehicle.getCategory().getId())
                .categoryName(vehicle.getCategory().getName())
                .createdAt(vehicle.getCreatedAt())
                .updatedAt(vehicle.getUpdatedAt())
                .build();
    }
}