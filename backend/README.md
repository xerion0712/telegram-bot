# Backend - Telegram Bot API

NestJS backend for the Telegram Book Reading Bot.

## Features

- Telegram bot integration using Telegraf
- Scheduled check-in questions every 5 minutes
- PostgreSQL database with TypeORM
- RESTful API for admin dashboard
- TypeScript for type safety

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file with:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHANNEL_ID=@your_channel
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=telegram_bot
PORT=3000
```

## Running the app

```bash
# development
npm run start:dev

# production
npm run build
npm run start:prod
```

## API Endpoints

- `GET /api/responses` - Get all responses
- `GET /api/responses/user?userId=123` - Get responses by user
- `GET /api/responses/stats` - Get statistics

## Project Structure

```
src/
├── entities/         # TypeORM entities
├── telegram/         # Telegram bot service
├── responses/        # API controllers & services
├── app.module.ts     # Root module
└── main.ts          # Application entry point
```

