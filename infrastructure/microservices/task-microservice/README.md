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
| POST | `tasks/sprints/:sprintId` | Add a new task to a sprint | JSON: `{ worker_id, project_manager_id, title, task_description, estimated_cost }` | 201: Created TaskResponseDTO, 400: Invalid input |
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

