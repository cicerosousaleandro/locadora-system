package com.locadora.vehicle.entity;

public enum VehicleStatus {
    AVAILABLE,      // Disponível para locação
    RENTED,         // Alugado no momento
    MAINTENANCE,    // Em manutenção
    DISABLED        // Desativado (não pode ser alugado)
}