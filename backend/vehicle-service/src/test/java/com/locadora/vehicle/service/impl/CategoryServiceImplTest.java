package com.locadora.vehicle.service.impl;

import com.locadora.vehicle.dto.CategoryRequest;
import com.locadora.vehicle.dto.CategoryResponse;
import com.locadora.vehicle.entity.Category;
import com.locadora.vehicle.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)  // Habilita o Mockito nos testes
class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    private CategoryRequest request;
    private Category category;

    @BeforeEach
    void setUp() {

        request = new CategoryRequest();
        request.setName("SUV");
        request.setDescription("Utilitário esportivo");
        request.setDailyRate(250.0);

        category = Category.builder()
                .id(1L)
                .name("SUV")
                .description("Utilitário esportivo")
                .dailyRate(250.0)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Deve criar categoria com sucesso quando nome é único")
    void deveCriarCategoriaComSucesso() {
        // ARRANGE: Configurar o comportamento do mock
        when(categoryRepository.existsByName("SUV")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(category);


        CategoryResponse response = categoryService.createCategory(request);


        assertNotNull(response);
        assertEquals("SUV", response.getName());
        assertEquals("Utilitário esportivo", response.getDescription());
        assertEquals(250.0, response.getDailyRate());
        assertEquals(0, response.getVehicleCount());


        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    @DisplayName("Deve lançar exceção quando categoria já existe")
    void deveLancarExcecaoQuandoCategoriaExiste() {

        when(categoryRepository.existsByName("SUV")).thenReturn(true);


        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> categoryService.createCategory(request)
        );

        assertEquals("Categoria já existe: SUV", exception.getMessage());


        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    @DisplayName("Deve retornar todas as categorias")
    void deveRetornarTodasCategorias() {
        // ARRANGE
        Category category2 = Category.builder()
                .id(2L)
                .name("Luxo")
                .description("Premium")
                .dailyRate(450.0)
                .build();

        when(categoryRepository.findAll()).thenReturn(java.util.List.of(category, category2));

        // ACT
        var responses = categoryService.getAllCategories();

        // ASSERT
        assertEquals(2, responses.size());
        assertEquals("SUV", responses.get(0).getName());
        assertEquals("Luxo", responses.get(1).getName());

        verify(categoryRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Deve excluir categoria quando não há veículos vinculados")
    void deveExcluirCategoriaSemVeiculos() {
        // ARRANGE
        category.setVehicles(new java.util.ArrayList<>());  // Lista vazia
        when(categoryRepository.findById(1L)).thenReturn(java.util.Optional.of(category));

        // ACT
        categoryService.deleteCategory(1L);

        // ASSERT
        verify(categoryRepository, times(1)).delete(category);
    }

    @Test
    @DisplayName("Deve lançar exceção ao excluir categoria com veículos vinculados")
    void deveLancarExcecaoAoExcluirCategoriaComVeiculos() {
        // ARRANGE: Categoria com 1 veículo vinculado
        var vehicle = com.locadora.vehicle.entity.Vehicle.builder().id(1L).build();
        category.setVehicles(java.util.List.of(vehicle));

        when(categoryRepository.findById(1L)).thenReturn(java.util.Optional.of(category));

        // ACT + ASSERT
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> categoryService.deleteCategory(1L)
        );

        assertTrue(exception.getMessage().contains("veículos vinculados"));
        verify(categoryRepository, never()).delete(any());
    }
}