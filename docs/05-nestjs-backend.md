# NestJS Backend (Модульная архитектура с DDD)

## Обзор

Backend построен на NestJS с модульной архитектурой, где каждый модуль изолирован и содержит внутри себя DDD слои (Domain, Application, Infrastructure, Presentation).

## Архитектурный подход

Модульная архитектура NestJS, где каждый модуль изолирован и содержит внутри себя DDD слои:
- **Domain Layer**: Сущности, Value Objects, Domain Interfaces
- **Application Layer**: Сервисы приложения, DTO, Use Cases
- **Infrastructure Layer**: Реализация репозиториев, внешние сервисы
- **Presentation Layer**: Controllers, Guards, Interceptors

## Структура модулей

```
apps/api/
├── src/
│   ├── modules/              # NestJS модули
│   │   ├── task/             # TaskModule
│   │   │   ├── domain/       # Domain Layer
│   │   │   │   ├── entities/
│   │   │   │   │   └── task.entity.ts
│   │   │   │   ├── value-objects/
│   │   │   │   │   ├── task-status.vo.ts
│   │   │   │   │   └── task-priority.vo.ts
│   │   │   │   └── interfaces/
│   │   │   │       └── task.repository.interface.ts
│   │   │   ├── application/  # Application Layer
│   │   │   │   ├── services/
│   │   │   │   │   ├── task.service.ts
│   │   │   │   │   └── task-query.service.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-task.dto.ts
│   │   │   │       ├── update-task.dto.ts
│   │   │   │       └── task-response.dto.ts
│   │   │   ├── infrastructure/ # Infrastructure Layer
│   │   │   │   ├── persistence/
│   │   │   │   │   ├── mongodb/
│   │   │   │   │   │   ├── task.schema.ts
│   │   │   │   │   │   └── task.repository.ts
│   │   │   │   │   └── redis/
│   │   │   │   │       └── task-cache.repository.ts
│   │   │   │   └── external/
│   │   │   └── presentation/  # Presentation Layer
│   │   │       ├── controllers/
│   │   │       │   └── task.controller.ts
│   │   │       ├── guards/
│   │   │       └── interceptors/
│   │   │           └── task-cache.interceptor.ts
│   │   ├── user/             # UserModule
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   └── user.entity.ts
│   │   │   │   ├── value-objects/
│   │   │   │   └── interfaces/
│   │   │   │       └── user.repository.interface.ts
│   │   │   ├── application/
│   │   │   │   ├── services/
│   │   │   │   │   └── user.service.ts
│   │   │   │   └── dto/
│   │   │   ├── infrastructure/
│   │   │   │   └── persistence/
│   │   │   │       └── mongodb/
│   │   │   │           ├── user.schema.ts
│   │   │   │           └── user.repository.ts
│   │   │   └── presentation/
│   │   │       └── controllers/
│   │   │           └── user.controller.ts
│   │   ├── auth/             # AuthModule
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   └── interfaces/
│   │   │   ├── application/
│   │   │   │   ├── services/
│   │   │   │   │   └── auth.service.ts
│   │   │   │   └── dto/
│   │   │   ├── infrastructure/
│   │   │   │   └── strategies/
│   │   │   │       └── jwt.strategy.ts
│   │   │   └── presentation/
│   │   │       ├── controllers/
│   │   │       │   └── auth.controller.ts
│   │   │       ├── guards/
│   │   │       │   └── jwt-auth.guard.ts
│   │   │       └── decorators/
│   │   │           └── current-user.decorator.ts
│   │   └── shared/           # SharedModule
│   │       ├── filters/
│   │       ├── interceptors/
│   │       ├── pipes/
│   │       └── decorators/
│   ├── config/               # Конфигурация
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── app.config.ts
│   ├── common/               # Общие утилиты
│   │   ├── exceptions/
│   │   ├── filters/
│   │   └── interceptors/
│   └── main.ts
```

## Модули

### TaskModule

Управление задачами (CRUD операции). Импортирует MongooseModule для работы с MongoDB, RedisModule для кэширования. Регистрирует контроллер, сервис и репозитории через dependency injection.

### UserModule

Управление пользователями. Импортирует MongooseModule для работы с коллекцией пользователей. Регистрирует контроллер, сервис и репозиторий.

### AuthModule

Аутентификация и авторизация. Импортирует UserModule, настраивает JwtModule и PassportModule для JWT аутентификации. Регистрирует стратегию JWT и сервис аутентификации.

### SharedModule

Общие компоненты (filters, interceptors, pipes). Помечен как @Global() для доступности во всех модулях. Экспортирует RedisModule для использования в других модулях.

## DDD компоненты

### Domain Layer

#### Entities

**Task Entity:**

Инкапсулирует бизнес-логику задачи. Содержит методы для изменения статуса и проверки просроченности. Все поля readonly для обеспечения иммутабельности.

#### Value Objects

**TaskStatus Value Object:**

Определяет enum статусов задачи и класс-обертку с валидацией и логикой переходов между статусами. Обеспечивает корректность состояний задачи.

#### Interfaces

**Task Repository Interface:**

Определяет контракт для работы с хранилищем задач. Абстрагирует детали реализации persistence слоя от domain и application слоев.

### Application Layer

#### Services

**Task Service:**

Реализует use cases для работы с задачами. Использует репозиторий через интерфейс для работы с данными. Выполняет валидацию прав доступа (проверка userId) и бизнес-логику.

#### DTOs

**CreateTaskDto:**

Использует декораторы class-validator для валидации входящих данных. Определяет обязательные и опциональные поля с соответствующими типами и валидаторами.

### Infrastructure Layer

#### MongoDB Repository

**Task Repository Implementation:**

Реализует интерфейс ITaskRepository используя Mongoose. Преобразует MongoDB документы в domain entities через метод `toDomain()`. Инкапсулирует детали работы с базой данных.

### Presentation Layer

#### Controllers

**Task Controller:**

Обрабатывает HTTP запросы и делегирует выполнение сервисам. Использует guards для аутентификации. Извлекает данные пользователя из request для проверки прав доступа.

## Главный модуль приложения

**main.ts**: Инициализирует NestJS приложение, настраивает глобальные pipes для валидации, включает CORS, запускает сервер на указанном порту.

**app.module.ts**: Корневой модуль приложения. Импортирует ConfigModule, MongooseModule и все бизнес-модули. Настраивает глобальную конфигурацию и подключение к базе данных.

## Принципы модульной архитектуры

1. **Изоляция модулей**: Каждый модуль независим и может быть переиспользован
2. **Четкие интерфейсы**: Модули взаимодействуют через интерфейсы
3. **DDD внутри модулей**: Каждый модуль следует DDD принципам
4. **Dependency Injection**: Использование DI для управления зависимостями
5. **Separation of Concerns**: Четкое разделение ответственности между слоями
