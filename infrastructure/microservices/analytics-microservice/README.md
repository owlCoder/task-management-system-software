# Analytics Microservice

Microservice odgovoran za projektne i finansijske analitike. Servis je read-only (GET/HEAD), sa blokadom write/DDL upita.

## Features
- Burndown i Burnup analitika po sprintu
- Velocity analitika po projektu
- Budget tracking po projektu
- Resource cost allocation po projektu
- Profit margin po projektu
- Time-series podaci za projekte i radnike u poslednjih 30 dana
- SIEM logovanje i audit trail
- Read-only HTTP guard + blokada write/DDL SQL upita

## API Endpoints

Base path: `/api/v1`

| Method | Route | Description | Response |
|--------|-------|-------------|----------|
| GET | `/analytics/burndown/:sprintId` | Burndown analytics za sprint | 200: BurndownDto, 400: invalid id, 404: not found |
| GET | `/analytics/burnup/:sprintId` | Burnup analytics za sprint | 200: BurnupDto, 400/404 |
| GET | `/analytics/velocity/:projectId` | Velocity za projekat | 200: number, 400/404 |
| GET | `/analytics/budget/:projectId` | Budget tracking za projekat | 200: BudgetTrackingDto, 400/404 |
| GET | `/analytics/resource-cost/:projectId` | Resource cost allocation | 200: ResourceCostAllocationDto, 400/404 |
| GET | `/analytics/profit-margin/:projectId` | Profit margin | 200: ProfitMarginDto, 400/404 |
| GET | `/analytics/projects-last-30-days` | Projekti startovani u poslednjih 30 dana | 200: TimeSeriesPointDto[] |
| GET | `/analytics/workers-last-30-days` | Radnici dodati u poslednjih 30 dana | 200: TimeSeriesPointDto[] |

Health:
- GET `/health` -> `{ "status": "ok" }`

## DTOs (Responses)

### BurndownDto
```json
{
  "project_id": 1,
  "sprint_id": 10,
  "tasks": [
    {
      "task_id": 5,
      "task_name": "Task title",
      "ideal_progress": 12.5,
      "real_progress": 10.0
    }
  ]
}
```

### BurnupDto
```json
{
  "project_id": 1,
  "sprint_id": 10,
  "sprint_duration_date": 14,
  "work_amount": 120,
  "points": [
    { "x": 0, "y": 10 },
    { "x": 3, "y": 25 }
  ]
}
```

### BudgetTrackingDto
```json
{
  "project_id": 1,
  "allowed_budget": 10000,
  "total_spent": 4200,
  "remaining_budget": 5800,
  "variance": -5800
}
```

### ResourceCostAllocationDto
```json
{
  "project_id": 1,
  "resources": [
    { "user_id": 7, "total_cost": 1500 }
  ]
}
```

### ProfitMarginDto
```json
{
  "project_id": 1,
  "allowed_budget": 10000,
  "total_cost": 4200,
  "profit": 5800,
  "profit_margin_percentage": 58
}
```

### TimeSeriesPointDto
```json
{
  "date": "2026-01-31",
  "count": 3
}
```

## Setup

- Install dependencies: `npm install`
- Copy `.env.example` -> `.env` i popuni vrednosti
- Dev: `npm run dev`
- Build: `npm run build`
- Start (ts-node): `npm run start`
- Start (dist): `npm run start:dist`

## Environment Configuration (.env)

Server:
- `PORT` (default: 5100)
- `NODE_ENV`

CORS:
- `CORS_ORIGIN` (default: `http://localhost:4000`)
- `CORS_METHODS` (default: `GET,OPTIONS`)

Projects DB (read-only):
- `PROJECTS_DB_HOST`
- `PROJECTS_DB_PORT`
- `PROJECTS_DB_USER`
- `PROJECTS_DB_PASSWORD`
- `PROJECTS_DB_NAME`

Tasks DB (read-only):
- `TASKS_DB_HOST`
- `TASKS_DB_PORT`
- `TASKS_DB_USER`
- `TASKS_DB_PASSWORD`
- `TASKS_DB_NAME`

Fallback (ako gornji nisu setovani):
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`

SSL:
- `DB_SSL` (true/false)