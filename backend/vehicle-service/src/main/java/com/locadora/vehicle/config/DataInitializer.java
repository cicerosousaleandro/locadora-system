package com.locadora.vehicle.config;

import com.locadora.vehicle.entity.Category;
import com.locadora.vehicle.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("🚀 Iniciando seed de categorias iniciais...");

        createCategoryIfNotExists("Econômico", "Carros compactos e econômicos para o dia a dia", 120.0);
        createCategoryIfNotExists("Intermediário", "Sedans médios com bom conforto", 180.0);
        createCategoryIfNotExists("SUV", "Utilitários esportivos para família e aventura", 250.0);
        createCategoryIfNotExists("Luxo", "Veículos premium com alto padrão de conforto", 450.0);
        createCategoryIfNotExists("Picape", "Veículos para carga e trabalho pesado", 220.0);
    }

    private void createCategoryIfNotExists(String name, String description, Double dailyRate) {
        if (categoryRepository.existsByName(name)) {
            log.info("ℹ️ Categoria '{}' já existe.", name);
            return;
        }

        Category category = Category.builder()
                .name(name)
                .description(description)
                .dailyRate(dailyRate)
                .build();

        categoryRepository.save(category);
        log.info("✅ Categoria '{}' criada com taxa diária R$ {}", name, dailyRate);
    }
}