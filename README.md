# Telegram Bot

A full-stack Telegram bot application with separate frontend and backend components, containerized with Docker.

## Features

- **Backend**: Robust server implementation for handling Telegram bot logic
- **Frontend**: User interface for bot management and monitoring
- **Docker Support**: Containerized deployment with Docker Compose
- **Modern Stack**: Built with Node.js 16+ for optimal performance

## Quick Start

### Prerequisites

- **Node.js 16+** - Download from [nodejs.org](https://nodejs.org/)
- **Docker** (optional) - For containerized deployment
- **Docker Compose** (optional) - For multi-container management

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/xerion0712/telegram-bot.git
   cd telegram-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env` (if available)
   - Configure your Telegram Bot Token and other environment variables

4. **Development**
   ```bash
   # Start backend
   npm run dev:backend
   
   # Start frontend
   npm run dev:frontend
   ```

## Docker Deployment

For production deployment using Docker:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
DATABASE_URL=your_database_url
PORT=3000
```

## Available Scripts

Check `package.json` for available npm scripts:

```bash
npm run start    # Start production server
npm run dev      # Start development server
npm run build    # Build for production
npm test         # Run tests
```
