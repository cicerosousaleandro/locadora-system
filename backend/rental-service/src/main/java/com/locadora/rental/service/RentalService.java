package com.locadora.rental.service;

import com.locadora.rental.client.VehicleClient;
import com.locadora.rental.dto.RentalRequest;
import com.locadora.rental.dto.RentalResponse;
import com.locadora.rental.dto.VehicleDTO;
import com.locadora.rental.entity.Rental;
import com.locadora.rental.enums.RentalStatus;
import com.locadora.rental.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;
    private final VehicleClient vehicleClient;

    @Transactional
    public RentalResponse createRental(RentalRequest request) {
        VehicleDTO vehicle = vehicleClient.getVehicleById(request.vehicleId());

        if (vehicle == null) {
            throw new RuntimeException("Veículo não encontrado.");
        }

        if (!"DISPONIVEL".equalsIgnoreCase(vehicle.status())) {
            throw new RuntimeException("Veículo não está disponível para locação.");
        }

        long days = ChronoUnit.DAYS.between(request.startDate(), request.endDate());
        if (days <= 0) {
            days = 1;
        }

        BigDecimal totalValue = vehicle.dailyRate().multiply(BigDecimal.valueOf(days));

        Rental rental = Rental.builder()
                .userId(request.userId())
                .vehicleId(request.vehicleId())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .totalValue(totalValue)
                .status(RentalStatus.ACTIVE)
                .build();

        Rental savedRental = rentalRepository.save(rental);

        return mapToResponse(savedRental);
    }

    public List<RentalResponse> getAllRentals() {
        return rentalRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    private RentalResponse mapToResponse(Rental rental) {
        return new RentalResponse(
                rental.getId(),
                rental.getUserId(),
                rental.getVehicleId(),
                rental.getStartDate(),
                rental.getEndDate(),
                rental.getTotalValue(),
                rental.getStatus(),
                rental.getCreatedAt()
        );
    }
}