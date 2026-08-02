package com.locadora.rental.repository;

import com.locadora.rental.entity.Rental;
import com.locadora.rental.enums.RentalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {

    List<Rental> findByVehicleIdAndStatusIn(Long vehicleId, List<RentalStatus> statuses);

    boolean existsByVehicleIdAndStatus(Long vehicleId, RentalStatus status);
}