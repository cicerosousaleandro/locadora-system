# 🚗 Locadora System

Sistema completo de gestão de locadora de veículos e vendas, desenvolvido com arquitetura de microserviços.

## 🎯 Objetivo do Projeto

Este projeto foi desenvolvido com foco em **aprendizado e domínio técnico**, simulando um ambiente de produção real com preocupações de:
-  Segurança da Informação e LGPD
- 📊 Auditoria completa de ações
-  Estratégia de Backup e Disaster Recovery
- 🏗️ Arquitetura escalável e desacoplada

## 🛠️ Stack Tecnológica

### Backend
- **Java 21** + **Spring Boot 3.x**
- **Spring Security** + **JWT** (Autenticação e Autorização)
- **Spring Data JPA** + **PostgreSQL**
- **RabbitMQ** (Mensageria assíncrona)
- **Maven** (Gerenciamento de dependências)

### Frontend
- **React** + **Vite**
- **Axios** (Cliente HTTP)
- **TailwindCSS** (Estilização)

### Infraestrutura
- **Docker** + **Docker Compose**
- **PostgreSQL 16** (Banco de dados)
- **RabbitMQ 3** (Message Broker)

## 🏗️ Arquitetura de Microserviços

O sistema é dividido em 5 microserviços independentes:

| Serviço | Descrição | Porta |
|---------|-----------|-------|
| `iam-service` | Identidade, Autenticação e Auditoria | 8081 |
| `fleet-service` | Gestão de Frota e Estoque | 8082 |
| `customer-service` | CRM e Gestão de Clientes (LGPD) | 8083 |
| `rental-service` | Core Business - Locações | 8084 |
| `finance-service` | Financeiro, Caixa e Retaguarda | 8085 |

## 🔒 Segurança e LGPD

- Criptografia de dados sensíveis (CPF, CNH) em repouso
- Senhas hash com BCrypt
- Logs de auditoria imutáveis com rastreamento de IP
- Controle de acesso baseado em perfis (RBAC)
- Mascaramento de dados sensíveis em logs

## 💾 Estratégia de Backup

- Backups automáticos diários do PostgreSQL
- Criptografia AES-256 dos arquivos de backup
- Política de retenção rotativa (7 dias / 4 semanas / 6 meses)
- Documentação de Disaster Recovery

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Java 21+
- Docker Desktop
- Node.js 20+ (para o frontend)

### 1. Subir a infraestrutura (PostgreSQL + RabbitMQ)
```bash
docker-compose up -d
