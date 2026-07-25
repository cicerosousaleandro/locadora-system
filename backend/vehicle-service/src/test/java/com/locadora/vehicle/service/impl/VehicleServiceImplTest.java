package com.locadora.vehicle.service.impl;

import com.locadora.vehicle.dto.VehicleRequest;
import com.locadora.vehicle.dto.VehicleResponse;
import com.locadora.vehicle.entity.Category;
import com.locadora.vehicle.entity.Vehicle;
import com.locadora.vehicle.entity.VehicleStatus;
import com.locadora.vehicle.repository.CategoryRepository;
import com.locadora.vehicle.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceImplTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private VehicleServiceImpl vehicleService;

    private VehicleRequest request;
    private Category category;
    private Vehicle vehicle;

    @BeforeEach
    void setUp() {
        category = Category.builder()
                .id(1L)
                .name("SUV")
                .dailyRate(250.0)
                .build();

        request = new VehicleRequest();
        request.setBrand("Toyota");
        request.setModel("SW4");
        request.setYear("2024");
        request.setPlate("ABC1234");
        request.setChassi("9BWZZZ377VT004251");  // 17 caracteres
        request.setColor("Prata");
        request.setSeats(7);
        request.setAirConditioning(true);
        request.setAutomaticTransmission(true);
        request.setStatus(VehicleStatus.AVAILABLE);
        request.setDailyRate(350.0);
        request.setCategoryId(1L);

        vehicle = Vehicle.builder()
                .id(1L)
                .brand("Toyota")
                .model("SW4")
                .year("2024")
                .plate("ABC1234")
                .chassi("9BWZZZ377VT004251")
                .color("Prata")
                .seats(7)
                .airConditioning(true)
                .automaticTransmission(true)
                .status(VehicleStatus.AVAILABLE)
                .dailyRate(350.0)
                .category(category)
                .build();
    }

    @Test
    @DisplayName("Deve criar veículo com sucesso")
    void deveCriarVeiculoComSucesso() {
        // ARRANGE
        when(vehicleRepository.existsByPlate("ABC1234")).thenReturn(false);
        when(vehicleRepository.existsByChassi("9BWZZZ377VT004251")).thenReturn(false);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(vehicle);

        // ACT
        VehicleResponse response = vehicleService.createVehicle(request);

        // ASSERT
        assertNotNull(response);
        assertEquals("Toyota", response.getBrand());
        assertEquals("SW4", response.getModel());
        assertEquals("ABC1234", response.getPlate());
        assertEquals("SUV", response.getCategoryName());
        assertEquals(350.0, response.getDailyRate());

        verify(vehicleRepository, times(1)).save(any(Vehicle.class));
    }

    @Test
    @DisplayName("Deve lançar exceção quando placa já existe")
    void deveLancarExcecaoQuandoPlacaExiste() {
        // ARRANGE
        when(vehicleRepository.existsByPlate("ABC1234")).thenReturn(true);

        // ACT + ASSERT
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> vehicleService.createVehicle(request)
        );

        assertEquals("Placa já cadastrada: ABC1234", exception.getMessage());
        verify(vehicleRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção quando chassi já existe")
    void deveLancarExcecaoQuandoChassiExiste() {
        // ARRANGE
        when(vehicleRepository.existsByPlate("ABC1234")).thenReturn(false);
        when(vehicleRepository.existsByChassi("9BWZZZ377VT004251")).thenReturn(true);

        // ACT + ASSERT
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> vehicleService.createVehicle(request)
        );

        assertEquals("Chassi já cadastrado: 9BWZZZ377VT004251", exception.getMessage());
        verify(vehicleRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção quando categoria não existe")
    void deveLancarExcecaoQuandoCategoriaNaoExiste() {
        // ARRANGE
        when(vehicleRepository.existsByPlate("ABC1234")).thenReturn(false);
        when(vehicleRepository.existsByChassi("9BWZZZ377VT004251")).thenReturn(false);
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        // ACT + ASSERT
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> vehicleService.createVehicle(request)
        );

        assertEquals("Categoria não encontrada: 1", exception.getMessage());
        verify(vehicleRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve retornar veículo por ID")
    void deveRetornarVeiculoPorId() {
        // ARRANGE
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));

        // ACT
        Optional<VehicleResponse> response = vehicleService.getVehicleById(1L);

        // ASSERT
        assertTrue(response.isPresent());
        assertEquals("Toyota", response.get().getBrand());
        assertEquals("SW4", response.get().getModel());
    }

    @Test
    @DisplayName("Deve retornar Optional vazio quando veículo não existe")
    void deveRetornarVazioQuandoVeiculoNaoExiste() {
        // ARRANGE
        when(vehicleRepository.findById(999L)).thenReturn(Optional.empty());

        // ACT
        Optional<VehicleResponse> response = vehicleService.getVehicleById(999L);

        // ASSERT
        assertFalse(response.isPresent());
    }
}