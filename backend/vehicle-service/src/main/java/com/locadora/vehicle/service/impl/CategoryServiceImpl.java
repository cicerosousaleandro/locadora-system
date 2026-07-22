package com.locadora.vehicle.service.impl;

import com.locadora.vehicle.dto.CategoryRequest;
import com.locadora.vehicle.dto.CategoryResponse;
import com.locadora.vehicle.entity.Category;
import com.locadora.vehicle.repository.CategoryRepository;
import com.locadora.vehicle.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Categoria já existe: " + request.getName());
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .dailyRate(request.getDailyRate() != null ? request.getDailyRate() : 0.0)
                .build();

        Category saved = categoryRepository.save(category);
        return convertToResponse(saved);
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<CategoryResponse> getCategoryById(Long id) {
        return categoryRepository.findById(id).map(this::convertToResponse);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada: " + id));

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        if (request.getDailyRate() != null) {
            category.setDailyRate(request.getDailyRate());
        }

        Category updated = categoryRepository.save(category);
        return convertToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada: " + id));

        if (!category.getVehicles().isEmpty()) {
            throw new RuntimeException("Não é possível excluir categoria com veículos vinculados.");
        }

        categoryRepository.delete(category);
    }

    private CategoryResponse convertToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .dailyRate(category.getDailyRate())
                .vehicleCount(category.getVehicles().size())
                .createdAt(category.getCreatedAt())
                .build();
    }
}