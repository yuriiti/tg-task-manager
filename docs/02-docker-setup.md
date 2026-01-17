# Docker Setup

## Обзор

Docker Compose конфигурация для локальной разработки. Включает все необходимые сервисы: API, MongoDB и Redis.

## Структура

```
task-manager/
├── docker-compose.dev.yml
├── docker/
│   ├── api/
│   │   └── Dockerfile.dev
│   ├── mongodb/
│   │   └── init-mongo.js
│   └── scripts/
│       └── start-dev.sh
└── .env (создается вручную или через скрипт)
```

## docker-compose.dev.yml

Определяет три сервиса:
- **mongodb**: База данных MongoDB (версия 7.0) с health checks, volumes для персистентности и инициализационным скриптом
- **redis**: Redis сервер (версия 7.2-alpine) с AOF persistence и health checks
- **api**: NestJS приложение с hot reload через volume mounts

Все сервисы подключены к изолированной сети `task-manager-network` и используют health checks для управления зависимостями. Сервис API зависит от MongoDB и Redis и запускается только после их готовности.

## Dockerfile для API (dev)

Использует Node.js 22 Alpine образ, устанавливает pnpm через corepack, копирует workspace конфигурацию (package.json, pnpm-workspace.yaml, pnpm-lock.yaml), устанавливает зависимости для всех пакетов монорепозитория и копирует исходный код. Поддерживает hot reload в dev режиме через volume mounts.

## MongoDB инициализация

Скрипт инициализации создает базу данных, пользователя приложения, коллекции и необходимые индексы при первом запуске контейнера.

## Environment Variables

Переменные окружения настраиваются через файл `.env` в корне проекта. Docker Compose использует значения по умолчанию, если переменные не заданы:

- **MongoDB**: `MONGO_INITDB_ROOT_USERNAME`, `MONGO_INITDB_ROOT_PASSWORD`, `MONGO_INITDB_DATABASE`
- **Redis**: `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB`
- **API**: `API_PORT`, `MONGODB_HOST`, `MONGODB_PORT`, `MONGODB_DATABASE`, `MONGODB_USER`, `MONGODB_PASSWORD`, `REDIS_HOST`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN`

Скрипт `docker/scripts/start-dev.sh` автоматически проверяет наличие `.env` файла при запуске.

## Команды

### Быстрый запуск

Используйте скрипт для автоматического запуска:
```bash
./docker/scripts/start-dev.sh
```

### Управление сервисами

- Запуск всех сервисов в фоновом режиме:
  ```bash
  docker-compose -f docker-compose.dev.yml up -d
  ```

- Запуск с пересборкой образов:
  ```bash
  docker-compose -f docker-compose.dev.yml up -d --build
  ```

- Остановка всех сервисов:
  ```bash
  docker-compose -f docker-compose.dev.yml down
  ```

- Остановка с удалением volumes (для полной очистки данных):
  ```bash
  docker-compose -f docker-compose.dev.yml down -v
  ```

### Просмотр логов

- Все сервисы:
  ```bash
  docker-compose -f docker-compose.dev.yml logs -f
  ```

- Конкретный сервис:
  ```bash
  docker-compose -f docker-compose.dev.yml logs -f api
  ```

### Выполнение команд в контейнерах

- MongoDB:
  ```bash
  docker exec -it task-manager-mongodb mongosh
  ```

- Redis:
  ```bash
  docker exec -it task-manager-redis redis-cli
  ```

- API (bash):
  ```bash
  docker exec -it task-manager-api sh
  ```

### Перезапуск сервисов

- Перезапуск конкретного сервиса:
  ```bash
  docker-compose -f docker-compose.dev.yml restart api
  ```

- Перезапуск всех сервисов:
  ```bash
  docker-compose -f docker-compose.dev.yml restart
  ```

## Health Checks

Все сервисы имеют health checks для обеспечения готовности перед запуском зависимых сервисов.

- **MongoDB**: Проверка через `mongosh --eval "db.adminCommand('ping')"`
- **Redis**: Проверка через `redis-cli ping`

## Volumes

- **mongodb_data**: Хранит данные MongoDB
- **mongodb_config**: Хранит конфигурацию MongoDB
- **redis_data**: Хранит данные Redis (AOF persistence)

## Networks

Все сервисы подключены к изолированной сети `task-manager-network` для безопасной коммуникации.

## Hot Reload

API сервис настроен на hot reload через volume mounts:
- Исходный код API монтируется из `./apps/api`
- Пакеты монорепозитория монтируются из `./packages`
- `node_modules` исключены из монтирования для производительности (используются анонимные volumes)
- Команда запуска: `pnpm --filter api dev`

## Порты

- **3000**: API приложение
- **27017**: MongoDB
- **6379**: Redis

## Production Considerations

Для production окружения рекомендуется:

1. Использовать отдельные Dockerfile без dev зависимостей
2. Настроить секреты через Docker secrets или внешние системы
3. Использовать внешние managed сервисы для MongoDB и Redis
4. Настроить reverse proxy (nginx) для API
5. Использовать Docker Swarm или Kubernetes для оркестрации
