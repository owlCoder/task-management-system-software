# Task Microservice

A microservice responsible for managing tasks and comments in projects.

## Features
- Create, read, and list tasks for projects
- Add comments to tasks
- Dummy data endpoints for development/testing

## API Endpoints

### Tasks
| Method | Route | Description | Request Body | Response |
|--------|-------|-------------|--------------|----------|
| GET | `/tasks/:taskId` | Get a single task by ID, including its comments | None | 200: TaskResponseDTO object, 404 if not found |
| POST | `tasks/sprints/:sprintId` | Add a new task to a sprint | JSON: `{ worker_id, project_manager_id, title, task_description, estimated_cost }` | 200: Created TaskResponseDTO, 400: Invalid input |
| PUT | `/tasks/:taskId` | Update an existing task | JSON: `{ title?, description?, estimatedCost?, status?, assignedTo? }` | 200: Updated TaskResponseDTO, 400: Validation error, 404: Task not found |
| DELETE | `/tasks/:taskId` | Delete a task by ID | None | 204: No Content, 400: Invalid ID, 404: Task not found |
| GET | `tasks/sprints/:sprintId` | Get all tasks for a sprint | None | 200: Array of TaskResponseDTO |

### Comments
| Method | Route | Description | Request Body | Response |
|--------|-------|-------------|--------------|----------|
| POST | `/tasks/:taskId/comments` | Add a comment to a task | JSON: `{ user_id, comment }` | 201: Created CommentResponseDTO, 400/404 if invalid |

### Development / Dummy
| Method | Route | Description | Request Body | Response |
|--------|-------|-------------|--------------|----------|
| GET | `/dev/dummy-tasks` | Get a list of dummy tasks (for development/testing) | None | 200: Array of TaskResponseDTO |

## Notes
- `TaskResponseDTO` includes task information and an array of comments.  
- `CommentResponseDTO` includes comment information and the `task_id` it belongs to.  

## Update Task (PUT) Details

### Request Body Fields
All fields are **optional** - možete ažurirati samo određena polja:

```json
{
  "title": "string (min 1 char)",
  "description": "string (min 1 char)",
  "estimatedCost": "number (>= 0)",
  "status": "enum: CREATED, PENDING, IN_PROGRESS, COMPLETED, NOT_COMPLETED, CANCELLED",
  "assignedTo": "number (> 0) - worker_id"
}
```

### Example Requests

**Update samo naslov:**
```json
{
  "title": "Nova verzija naslova"
}
```

**Update status:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Update sva polja:**
```json
{
  "title": "Novi naslov",
  "description": "Novi opis",
  "estimatedCost": 200,
  "status": "COMPLETED",
  "assignedTo": 5
}
```

### Validacija
Sve validacije se izvršavaju kroz `UpdateTaskValidator` klasu:
- Title i description moraju biti non-empty stringovi
- EstimatedCost mora biti >= 0
- Status mora biti validen enum
- AssignedTo mora biti pozitivan broj
- Najmanje jedno polje mora biti prosleđeno (ne sme biti prazan DTO)

---

## Delete Task (DELETE) Details

### Status Codes
- **204 No Content** - Task je uspešno obrisan
- **400 Bad Request** - Nevažeći ID (nije broj ili <= 0)
- **404 Not Found** - Task sa tim ID-om ne postoji

### Validacija
ID se validira kroz `DeleteTaskValidator` klasu:
- ID mora biti broj
- ID mora biti > 0

---

## Validators

Sve validacije su organizovane u `src/Utils/Validators/` folderu:

- **UpdateTaskValidator** - Validira PUT zahteve za ažuriranje taskova
- **DeleteTaskValidator** - Validira DELETE zahteve i ID parametre