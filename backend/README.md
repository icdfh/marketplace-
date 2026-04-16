# Marketplace Express + PostgreSQL API

Готовый бэкенд под практику: фронт и мобильное приложение могут работать с одним API.

## Что внутри
- Express 4
- PostgreSQL
- JWT авторизация
- Роли: buyer / seller / admin
- Каталог товаров
- Рубрики
- Избранное
- Корзина
- Отзывы и рейтинг
- Чаты и сообщения
- SQL schema + seed

## Быстрый старт

```bash
npm install
cp .env.example .env
npm run start
```

## Поднять базу
1. Создать PostgreSQL базу `marketplace_db`
2. Указать `DATABASE_URL` в `.env`
3. Выполнить:

```bash
npm run db:init
npm run db:seed
```

## Тестовые аккаунты
Пароль для всех seed-пользователей: `password123`

- admin@example.com
- seller1@example.com
- buyer1@example.com

## Основные эндпоинты

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Users
- `GET /api/users/:id`
- `PATCH /api/users/me/profile`

### Rubrics
- `GET /api/rubrics`
- `POST /api/rubrics` (admin)

### Items
- `GET /api/items`
- `GET /api/items/:id`
- `POST /api/items` (seller/admin)
- `PATCH /api/items/:id` (seller/admin)
- `DELETE /api/items/:id` (seller/admin)

Поддерживаются query params:
- `search`
- `status`
- `rubricId`
- `sellerId`
- `page`
- `limit`

### Favorites
- `GET /api/favorites`
- `POST /api/favorites`
- `DELETE /api/favorites/:itemId`

### Cart
- `GET /api/cart`
- `POST /api/cart`
- `PATCH /api/cart/:itemId`
- `DELETE /api/cart/:itemId`

### Feedback
- `GET /api/feedback/item/:itemId`
- `POST /api/feedback`

### Chats
- `GET /api/chats`
- `POST /api/chats`
- `GET /api/chats/:chatId/messages`
- `POST /api/chats/:chatId/messages`
- `POST /api/chats/:chatId/read`

## Пример Authorization header
```http
Authorization: Bearer <jwt_token>
```

## Пример регистрации
```json
{
  "email": "student1@example.com",
  "password": "password123",
  "username": "student1",
  "firstName": "Aruzhan",
  "lastName": "User",
  "userType": "buyer"
}
```

## Пример создания товара
```json
{
  "rubricId": "rubric-uuid",
  "title": "MacBook Air M1",
  "description": "Лёгкий ноутбук, хорошее состояние",
  "price": 350000,
  "images": [
    "https://site.com/image-1.jpg",
    "https://site.com/image-2.jpg"
  ],
  "status": "active"
}
```

## Что дальше
1. Фронт на React / Next / Vue
2. Мобилку на React Native / Expo
3. Фильтрацию по рубрикам
4. Страницу товара
5. Личный кабинет продавца
6. Мессенджер внутри приложения
7. Избранное и корзину

## Что можно улучшить потом
- refresh token
- загрузка изображений в S3 / Cloudinary
- pagination metadata
- websocket для real-time чатов
- swagger
- orders / checkout / payments
- admin moderation panel
