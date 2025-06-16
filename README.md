# TaskManagementApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`.

# Task Management Frontend

An Angular frontend application for the Task Management, featuring user authentication, task management.

## Features

- **User Authentication**: Login and registration forms with JWT token handling
- **Task Management**: Complete CRUD interface for tasks
- **Responsive Design**: Built with Angular
- **Dockerized**: Containerized deployment with Nginx
- **API Integration**: Integration with Task Management API backend

## Prerequisites

- **Task Management API Backend** (available as Docker image)
- **Backend Repository**: [TaskManagement API](https://github.com/SarahAlkhalawi/TaskManagement-API-Assessment)

## Backend Setup

Before running this frontend, you need to set up the backend:

1. **Clone the backend repository**:
   ```bash
   git clone https://github.com/SarahAlkhalawi/TaskManagement-API-Assessment.git
   cd TaskManagement-API-Assessment
   ```

2. **Build the backend Docker image**:
   ```bash
   docker build -t taskmanagement-taskmanagement-api:latest .
   ```

3. **Or run the backend separately**:
   ```bash
   docker-compose up --build
   ```

## Quick Start

### 1. Clone and Setup

### 2. Verify Backend Image

```powershell
# Check that backend image exists
docker images | findstr taskmanagement-taskmanagement-api
```

### 3. Run Full Stack

```bash
docker-compose up --build
```

### 4. Access Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:5001
- **Backend Swagger**: http://localhost:5001/swagger/index.html

## Application Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Angular)     │◄──►│   (.NET Core)   │◄──►│   (SQL Server)  │
│   Port: 4200    │    │   Port: 5001    │    │   Port: 1434    │
│   Nginx Proxy   │    │   Container:    │    │   Container:    │
│                 │    │   api1          │    │   db1           │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## API Integration

### Authentication Flow

1. User logs in through frontend login form
2. Backend returns JWT token
3. Frontend stores token and includes in subsequent API requests
4. Protected routes require valid JWT token

### Available API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task


### Docker Commands

```bash
# Start all services
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f task-management-frontend
docker-compose logs -f taskmanagement-api1

# Remove everything (including data)
docker-compose down -v
```
