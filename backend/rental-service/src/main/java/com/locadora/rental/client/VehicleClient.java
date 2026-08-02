package com.locadora.rental.client;

import com.locadora.rental.dto.VehicleDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "vehicle-service", url = "http://localhost:8083")
public interface VehicleClient {

    @GetMapping("/api/vehicles/{id}")
    VehicleDTO getVehicleById(@PathVariable("id") Long id);
}