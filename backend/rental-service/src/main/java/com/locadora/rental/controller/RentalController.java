package com.locadora.rental.controller;

import com.locadora.rental.dto.RentalRequest;
import com.locadora.rental.dto.RentalResponse;
import com.locadora.rental.service.RentalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public ResponseEntity<RentalResponse> createRental(@Valid @RequestBody RentalRequest request) {
        RentalResponse response = rentalService.createRental(request);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    public ResponseEntity<List<RentalResponse>> getAllRentals() {
        return ResponseEntity.ok(rentalService.getAllRentals());
    }
}