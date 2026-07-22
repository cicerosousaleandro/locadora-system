package com.locadora.vehicle.repository;

import com.locadora.vehicle.entity.Vehicle;
import com.locadora.vehicle.entity.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByPlate(String plate);
    Optional<Vehicle> findByChassi(String chassi);
    boolean existsByPlate(String plate);
    boolean existsByChassi(String chassi);
    List<Vehicle> findByStatus(VehicleStatus status);
    List<Vehicle> findByCategoryId(Long categoryId);

    @Query("SELECT v FROM Vehicle v WHERE " +
            "(:brand IS NULL OR LOWER(v.brand) LIKE LOWER(CONCAT('%', :brand, '%'))) AND " +
            "(:model IS NULL OR LOWER(v.model) LIKE LOWER(CONCAT('%', :model, '%'))) AND " +
            "(:status IS NULL OR v.status = :status) AND " +
            "(:categoryId IS NULL OR v.category.id = :categoryId) AND " +
            "(:minRate IS NULL OR v.dailyRate >= :minRate) AND " +
            "(:maxRate IS NULL OR v.dailyRate <= :maxRate)")
    List<Vehicle> findWithFilters(
            @Param("brand") String brand,
            @Param("model") String model,
            @Param("status") VehicleStatus status,
            @Param("categoryId") Long categoryId,
            @Param("minRate") Double minRate,
            @Param("maxRate") Double maxRate
    );
}