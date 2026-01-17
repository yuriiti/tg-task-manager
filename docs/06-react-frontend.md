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
- **@tma.js/sdk** - для работы с Telegram Mini App API
- **Vite** - build tool

## Основные фичи

- **Авторизация через Telegram Mini App** (app/providers/auth.provider)
- **Welcome страница** (pages/welcome) - показывается один раз при первом запуске
- **Home страница** (pages/home) - главная страница после Welcome
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

## Авторизация

### Архитектура авторизации

Приложение использует **stateless авторизацию** через Telegram Mini App initData:

- **Нет токенов**: Авторизация происходит через initData в заголовке каждого запроса
- **`/auth/login` endpoint**: Возвращает `AuthResult` (информацию о пользователе) из `@task-manager/types`
- **Автоматическая авторизация**: При старте приложения выполняется автоматический login
- **Dev режим**: Используется mock initData для локальной разработки

### Компоненты авторизации

#### AuthProvider (`app/providers/auth.provider.tsx`)

Провайдер для управления состоянием авторизации:

- Автоматически выполняет login при монтировании
- Сохраняет информацию о пользователе в состоянии
- Предоставляет контекст через `useAuth()` hook
- Интегрирован с React Query для выполнения запросов

**Использование:**
```tsx
import { useAuth } from '@/app/providers/auth.provider';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  // ...
}
```

#### Login Mutation (`entities/user/model/user.mutations.ts`)

React Query mutation для авторизации:

- Получает initData через `@tma.js/sdk` или mock в dev режиме
- Отправляет запрос на `/auth/login` с initData в заголовке
- Возвращает `AuthResult` с информацией о пользователе

#### API Client (`shared/api/client.ts`)

Axios клиент с автоматическим добавлением initData:

- Добавляет initData в заголовок `Authorization: TMA <initData>` при каждом запросе
- В dev режиме использует mock: `Authorization: mock-tma <mockData>`
- Обрабатывает 401 ошибки (редирект на login)

### Защищенные роуты

Используются компоненты `ProtectedRoute` и `WelcomeGuard`:

- **ProtectedRoute**: Проверяет авторизацию, редиректит на `/login` если не авторизован
- **WelcomeGuard**: Проверяет, показывалась ли Welcome страница, редиректит на `/welcome` если нет

## ClientStorage (DDD подход)

### Архитектура

Система хранения данных с поддержкой разных типов хранилища через паттерн Adapter:

- **Интерфейс IStorage**: Единый интерфейс для всех типов хранилища
- **Адаптеры**: Реализации для LocalStorage, SessionStorage, Telegram CloudStorage
- **Фабрика**: Автоматический выбор типа хранилища

### Типы хранилища

1. **Telegram CloudStorage** (приоритет) - через `@tma.js/sdk`
2. **LocalStorage** - браузерное хранилище
3. **SessionStorage** - fallback

### Использование

```tsx
import { getDefaultStorage, STORAGE_KEYS } from '@/shared/lib/storage';

const storage = getDefaultStorage();

// Сохранение
await storage.setItem(STORAGE_KEYS.WELCOME_SHOWN, 'true');

// Получение
const value = await storage.getItem(STORAGE_KEYS.WELCOME_SHOWN);

// Удаление
await storage.removeItem(STORAGE_KEYS.WELCOME_SHOWN);
```

### Структура

```
shared/lib/storage/
├── storage.interface.ts          # Интерфейс IStorage
├── storage.types.ts             # Типы и константы
├── local-storage.adapter.ts      # Адаптер для LocalStorage
├── session-storage.adapter.ts    # Адаптер для SessionStorage
├── telegram-cloud-storage.adapter.ts  # Адаптер для Telegram CloudStorage
├── storage.factory.ts           # Фабрика для создания хранилища
└── index.ts                      # Экспорты
```

## Welcome и Home страницы

### Welcome страница (`pages/welcome`)

Приветственная страница, показываемая один раз при первом запуске:

- Проверяет флаг `welcomeShown` в ClientStorage
- Если флаг не установлен → показывает Welcome страницу
- После клика "Начать" → сохраняет флаг и переходит на Home
- Использует ClientStorage для сохранения состояния

### Home страница (`pages/home`)

Главная страница приложения после Welcome:

- Отображается после прохождения Welcome
- Интегрирована с существующими виджетами задач
- Защищена через `ProtectedRoute` (требует авторизации)

### Роутинг

Логика роутинга:

1. **Welcome** (`/welcome`) - показывается если флаг `welcomeShown` не установлен
2. **Home** (`/` или `/home`) - главная страница, требует авторизации
3. **Login** (`/login`) - страница входа (fallback при ошибках авторизации)
4. **Tasks** (`/tasks`) - страница списка задач, требует авторизации

## Telegram SDK интеграция

### Инициализация

SDK инициализируется при старте приложения в `app/index.tsx`:

```tsx
import { initializeTelegramSDK } from '@/shared/lib/telegram/telegram-sdk';

initializeTelegramSDK();
```

### Утилиты (`shared/lib/telegram/telegram-sdk.ts`)

- `getInitData()` - получение initData из SDK
- `getCloudStorage()` - получение CloudStorage API
- `isTelegramSDKAvailable()` - проверка доступности SDK
- `isCloudStorageAvailable()` - проверка доступности CloudStorage

### Mock для dev режима

В dev режиме используется mock initData (`shared/lib/telegram/mock-init-data.ts`):

- Генерируется автоматически если SDK недоступен
- Формат: query string `telegramId=123456789&username=mockuser&...`
- Отправляется в заголовке `Authorization: mock-tma <mockData>`

## Единый endpoints

Все API endpoints определены в `shared/api/endpoints.ts`:

```ts
export const endpoints = {
  auth: {
    login: '/auth/login',
  },
  tasks: {
    list: '/tasks',
    detail: (id: string) => `/tasks/${id}`,
    // ...
  },
  // ...
};
```

Использование:
```ts
import { endpoints } from '@/shared/api/endpoints';
const url = endpoints.auth.login; // '/auth/login'
```

## Использование Ant Design

### Принципы

В проекте используется **Ant Design 6.2.0** для UI компонентов. При разработке компонентов следует:

1. **Использовать компоненты Ant Design вместо нативных HTML элементов со стилями**
   - Используйте `Flex`, `Space`, `Layout` вместо `div` с inline стилями
   - Используйте `Typography` для текстовых элементов
   - Используйте `Button`, `Input`, `Avatar` и другие компоненты из библиотеки

2. **Избегать inline стилей для layout**
   - Используйте пропсы компонентов Ant Design (`gap`, `align`, `justify`, `direction`)
   - Минимизируйте использование `style` пропса
   - Используйте встроенные пропсы компонентов для стилизации

### Основные компоненты для layout

#### Flex

Компонент для flexbox layout:

```tsx
import { Flex } from 'antd';

<Flex
  vertical              // flex-direction: column
  align="center"       // align-items: center
  justify="center"     // justify-content: center
  gap={24}             // gap между элементами
>
  <Avatar />
  <Typography.Title>Name</Typography.Title>
</Flex>
```

#### Space

Компонент для создания отступов между элементами:

```tsx
import { Space } from 'antd';

<Space orientation="vertical" align="center" size={4}>
  <Typography.Title>First Name</Typography.Title>
  <Typography.Text type="secondary">Last Name</Typography.Text>
</Space>
```

#### Typography

Компоненты для текстовых элементов:

```tsx
import { Typography } from 'antd';

const { Title, Text, Paragraph } = Typography;

<Title level={2}>Заголовок</Title>
<Text type="secondary">Вторичный текст</Text>
<Paragraph>Абзац текста</Paragraph>
```

### Пример: Страница профиля

**Плохо** (использование div со стилями):
```tsx
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <Avatar />
  <div style={{ textAlign: 'center' }}>
    <Title>Name</Title>
  </div>
</div>
```

**Хорошо** (использование компонентов Ant Design):
```tsx
<Flex vertical align="center" gap={24}>
  <Avatar size={120} />
  <Space orientation="vertical" align="center" size={4}>
    <Title level={2}>Name</Title>
    <Text type="secondary">Last Name</Text>
  </Space>
</Flex>
```

### Доступные компоненты

Все компоненты Ant Design доступны напрямую из пакета `antd`:

```tsx
import { 
  Avatar, 
  Button, 
  Flex, 
  Space, 
  Typography, 
  Layout,
  Input,
  Modal,
  // ... другие компоненты
} from 'antd';
```

### Кастомизация

Для глобальной кастомизации Ant Design используется `ConfigProvider` в `app/providers/antd.provider.tsx`. Для локальной кастомизации используйте пропсы компонентов или темы Ant Design.

### Деприкейтед API (НЕ ИСПОЛЬЗОВАТЬ)

⚠️ **ВАЖНО**: В проекте запрещено использовать устаревшие (deprecated) API Ant Design. При обновлении библиотеки эти API могут быть удалены, что приведет к поломке приложения.

#### Запрещенные API и их замены:

1. **`Space` компонент - `direction` проп**
   - ❌ **НЕ ИСПОЛЬЗОВАТЬ**: `<Space direction="vertical">`
   - ✅ **ИСПОЛЬЗОВАТЬ**: `<Space orientation="vertical">`
   - Причина: `direction` устарел в Ant Design 5+, заменен на `orientation`

2. **`Card` компонент - `bodyStyle` проп**
   - ❌ **НЕ ИСПОЛЬЗОВАТЬ**: `<Card bodyStyle={{ padding: '12px' }}>`
   - ✅ **ИСПОЛЬЗОВАТЬ**: `<Card styles={{ body: { padding: '12px' } }}>`
   - Причина: `bodyStyle` устарел в Ant Design 5+, заменен на `styles.body`

3. **`Descriptions` компонент - `span` и `column`**
   - ❌ **НЕ ИСПОЛЬЗОВАТЬ**: `<Descriptions>` без указания `column`, когда используется `span` в `Descriptions.Item`
   - ✅ **ИСПОЛЬЗОВАТЬ**: Всегда указывать `column` проп в `Descriptions`, если используется `span` в элементах
   - Пример:
     ```tsx
     <Descriptions column={3}>
       <Descriptions.Item label="Name" span={3}>...</Descriptions.Item>
     </Descriptions>
     ```
   - Причина: Сумма `span` в строке должна соответствовать `column` для корректного отображения

#### Как проверить деприкейтед API:

1. Запустите приложение и проверьте консоль браузера на наличие предупреждений
2. Используйте линтер для проверки кода перед коммитом
3. При обновлении Ant Design проверяйте changelog на наличие breaking changes

#### При обнаружении деприкейтед API:

1. Немедленно замените на актуальный API
2. Проверьте все места использования в проекте через поиск
3. Обновите документацию, если необходимо
