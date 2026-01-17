# Task Manager

Монорепозиторий для управления задачами с NestJS backend и React frontend.

## Структура проекта

```
task-manager/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # React frontend
├── packages/
│   ├── shared/       # Общие утилиты
│   ├── ui/           # UI компоненты
│   └── types/        # TypeScript типы
└── docs/             # Документация
```

## Технологии

- **pnpm** - менеджер пакетов
- **Turbo** - инструмент для управления сборкой
- **NestJS** - backend framework
- **React** - frontend framework
- **MongoDB** - база данных
- **Redis** - кэширование и сессии
- **TypeScript** - типизация

## Установка

```bash
# Установка зависимостей
pnpm install
```

## Разработка

```bash
# Запуск всех приложений в dev режиме
pnpm dev

# Запуск конкретного приложения
pnpm --filter api dev
pnpm --filter web dev

# Сборка всех приложений
pnpm build

# Линтинг
pnpm lint
```

## Docker

```bash
# Запуск сервисов (MongoDB, Redis)
docker-compose up -d

# Остановка сервисов
docker-compose down

# Просмотр логов
docker-compose logs -f
```

## Документация

Подробная документация находится в папке `docs/`:

- [Монорепозиторий](docs/01-monorepo-structure.md)
- [Docker Setup](docs/02-docker-setup.md)
- [MongoDB Setup](docs/03-mongodb-setup.md)
- [Redis Setup](docs/04-redis-setup.md)
- [NestJS Backend](docs/05-nestjs-backend.md)
- [React Frontend](docs/06-react-frontend.md)
