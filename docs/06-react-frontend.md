# React Frontend (FSD Architecture)

## Обзор

Frontend построен на React с использованием Feature-Sliced Design (FSD) - методологии организации кода по бизнес-логике и функциональности с четким разделением слоев.

## Архитектурный подход

Feature-Sliced Design (FSD) - методология организации кода по бизнес-логике и функциональности с четким разделением слоев.

## Структура FSD

```
apps/web/
├── src/
│   ├── app/                      # Слой приложения
│   │   ├── providers/            # Провайдеры (Router, QueryClient, etc.)
│   │   │   ├── router.provider.tsx
│   │   │   ├── query.provider.tsx
│   │   │   └── antd.provider.tsx
│   │   ├── styles/               # Глобальные стили
│   │   └── index.tsx             # Точка входа
│   │
│   ├── processes/                # Слой процессов (сложные бизнес-сценарии)
│   │   ├── task-management/      # Процесс управления задачами
│   │   │   ├── ui/
│   │   │   │   └── task-management-process.tsx
│   │   │   └── model/
│   │   │       └── use-task-management.ts
│   │   └── auth-flow/            # Процесс аутентификации
│   │       ├── ui/
│   │       └── model/
│   │
│   ├── pages/                    # Слой страниц
│   │   ├── tasks/                # Страница списка задач
│   │   │   ├── ui/
│   │   │   │   └── tasks-page.tsx
│   │   │   └── index.ts
│   │   ├── task-detail/          # Страница деталей задачи
│   │   │   ├── ui/
│   │   │   │   └── task-detail-page.tsx
│   │   │   └── index.ts
│   │   └── login/                # Страница входа
│   │       ├── ui/
│   │       └── index.ts
│   │
│   ├── widgets/                  # Слой виджетов (крупные самостоятельные блоки)
│   │   ├── task-list/            # Виджет списка задач
│   │   │   ├── ui/
│   │   │   │   ├── task-list.tsx
│   │   │   │   └── task-item.tsx
│   │   │   ├── model/
│   │   │   │   └── use-task-list.ts
│   │   │   └── index.ts
│   │   ├── task-form/            # Виджет формы задачи
│   │   │   ├── ui/
│   │   │   │   └── task-form.tsx
│   │   │   ├── model/
│   │   │   │   └── use-task-form.ts
│   │   │   └── index.ts
│   │   ├── task-filters/         # Виджет фильтров
│   │   │   ├── ui/
│   │   │   │   └── task-filters.tsx
│   │   │   ├── model/
│   │   │   │   └── use-task-filters.ts
│   │   │   └── index.ts
│   │   └── header/               # Виджет шапки
│   │       ├── ui/
│   │       │   └── header.tsx
│   │       └── index.ts
│   │
│   ├── features/                 # Слой фич (действия пользователя)
│   │   ├── create-task/          # Фича создания задачи
│   │   │   ├── ui/
│   │   │   │   └── create-task-button.tsx
│   │   │   ├── model/
│   │   │   │   └── use-create-task.ts
│   │   │   └── index.ts
│   │   ├── edit-task/            # Фича редактирования задачи
│   │   │   ├── ui/
│   │   │   ├── model/
│   │   │   │   └── use-edit-task.ts
│   │   │   └── index.ts
│   │   ├── delete-task/          # Фича удаления задачи
│   │   │   ├── ui/
│   │   │   ├── model/
│   │   │   │   └── use-delete-task.ts
│   │   │   └── index.ts
│   │   ├── toggle-task-status/   # Фича изменения статуса
│   │   │   ├── ui/
│   │   │   ├── model/
│   │   │   └── index.ts
│   │   └── login/                 # Фича входа
│   │       ├── ui/
│   │       ├── model/
│   │       └── index.ts
│   │
│   ├── entities/                 # Слой сущностей (бизнес-сущности)
│   │   ├── task/                 # Сущность задачи
│   │   │   ├── ui/
│   │   │   │   ├── task-card.tsx
│   │   │   │   └── task-status-badge.tsx
│   │   │   ├── model/
│   │   │   │   ├── task.store.ts        # Zustand store
│   │   │   │   ├── task.queries.ts      # TanStack Query queries
│   │   │   │   └── task.mutations.ts   # TanStack Query mutations
│   │   │   ├── api/
│   │   │   │   └── task.api.ts          # API запросы
│   │   │   ├── lib/
│   │   │   │   └── task.utils.ts        # Утилиты
│   │   │   ├── config/
│   │   │   │   └── task.config.ts       # Конфигурация
│   │   │   └── index.ts
│   │   └── user/                 # Сущность пользователя
│   │       ├── ui/
│   │       ├── model/
│   │       │   ├── user.store.ts
│   │       │   └── user.queries.ts
│   │       ├── api/
│   │       │   └── user.api.ts
│   │       └── index.ts
│   │
│   └── shared/                   # Слой переиспользования
│       ├── ui/                   # UI компоненты
│       │   ├── button/
│       │   ├── input/
│       │   ├── modal/
│       │   ├── layout/
│       │   └── index.ts
│       ├── lib/                  # Утилиты
│       │   ├── utils/
│       │   ├── constants/
│       │   └── helpers/
│       ├── api/                  # API клиент
│       │   ├── client.ts         # Axios instance
│       │   └── interceptors.ts
│       ├── config/               # Конфигурация
│       │   └── env.ts
│       └── types/                # Типы
│           └── index.ts
```

## Принципы FSD

- **Слои**: app → processes → pages → widgets → features → entities → shared
- **Импорты только внутрь**: Каждый слой может импортировать только из слоев ниже
- **Изоляция**: Каждый слайс (feature, entity) изолирован и независим
- **Структура слайса**: ui, model, api, lib, config

## Слои FSD

### 1. app - Слой приложения

Инициализация приложения, провайдеры, глобальные настройки. Содержит провайдеры для Router, QueryClient, AntDesign. Композирует все провайдеры в корневом компоненте приложения.

### 2. processes - Слой процессов

Сложные бизнес-процессы, объединяющие несколько фич. Использует хуки из features слоя для создания комплексных бизнес-сценариев.

### 3. pages - Слой страниц

Композиция виджетов в страницы, роутинг. Страницы собираются из виджетов, фич и общих компонентов. Определяют структуру и layout страниц.

### 4. widgets - Слой виджетов

Крупные самостоятельные блоки интерфейса. Виджеты используют хуки из model для получения данных и состояний. Комбинируют UI компоненты и бизнес-логику.

### 5. features - Слой фич

Действия пользователя (создание, редактирование, удаление). Фичи содержат UI компоненты для действий и хуки для выполнения операций через TanStack Query mutations. Инвалидируют кэш после успешных операций.

### 6. entities - Слой сущностей

Бизнес-сущности (Task, User) с их логикой и состоянием. Содержит API методы для работы с сущностями, TanStack Query queries и mutations, Zustand stores для локального состояния, UI компоненты для отображения сущностей.

### 7. shared - Слой переиспользования

Переиспользуемые компоненты, утилиты, конфигурация. Содержит базовые UI компоненты, утилиты, API клиент с interceptors для добавления токенов, конфигурацию и типы.

## Технологии

- **React 19+** - UI библиотека
- **TypeScript** - для типизации
- **AntDesign 5+** - UI компоненты
- **TanStack Query v5** - data fetching (в entities/model)
- **Zustand** - state management (в entities/model)
- **React Router** - навигация
- **Axios** - HTTP запросы (в shared/api)
- **Vite** - build tool

## Основные фичи

- **Список задач** (widgets/task-list)
- **Создание задачи** (features/create-task)
- **Редактирование задачи** (features/edit-task)
- **Удаление задачи** (features/delete-task)
- **Фильтрация и поиск** (widgets/task-filters)

## Правила импортов

### Разрешенные импорты

- `app` может импортировать только из `shared`
- `processes` может импортировать из `features`, `entities`, `shared`
- `pages` может импортировать из `widgets`, `features`, `entities`, `shared`
- `widgets` может импортировать из `features`, `entities`, `shared`
- `features` может импортировать из `entities`, `shared`
- `entities` может импортировать только из `shared`
- `shared` не может импортировать из других слоев

### Алиасы путей

Настраиваются в vite.config.ts или tsconfig.json для использования абсолютных импортов через префикс `@/` вместо относительных путей.

## Структура слайса

Каждый слайс (feature, entity, widget) может содержать:

- **ui/** - компоненты интерфейса
- **model/** - бизнес-логика (stores, hooks, queries)
- **api/** - API запросы
- **lib/** - утилиты
- **config/** - конфигурация
- **index.ts** - публичный API слайса
