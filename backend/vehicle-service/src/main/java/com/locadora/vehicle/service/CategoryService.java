package com.locadora.vehicle.service;

import com.locadora.vehicle.dto.CategoryRequest;
import com.locadora.vehicle.dto.CategoryResponse;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest request);
    List<CategoryResponse> getAllCategories();
    Optional<CategoryResponse> getCategoryById(Long id);
    CategoryResponse updateCategory(Long id, CategoryRequest request);
    void deleteCategory(Long id);
}