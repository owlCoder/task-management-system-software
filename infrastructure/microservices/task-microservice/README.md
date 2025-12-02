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
| GET | `/tasks/:taskId` | Get a single task by ID, including its comments | None | 200: TaskDTO object, 404 if not found |
| POST | `/projects/:projectId/tasks` | Add a new task to a project | JSON: `{ worker_id, project_manager_id, title, task_description, estimated_cost }` | 201: Created TaskDTO, 400: Invalid input |
| GET | `/projects/:projectId/tasks` | Get all tasks for a project | None | 200: Array of TaskDTO |

### Comments
| Method | Route | Description | Request Body | Response |
|--------|-------|-------------|--------------|----------|
| POST | `/tasks/:taskId/comments` | Add a comment to a task | JSON: `{ user_id, comment }` | 201: Created CommentDTO, 400/404 if invalid |

### Development / Dummy
| Method | Route | Description | Request Body | Response |
|--------|-------|-------------|--------------|----------|
| GET | `/dev/dummy-tasks` | Get a list of dummy tasks (for development/testing) | None | 200: Array of TaskDTO |

## Notes
- `TaskDTO` includes task information and an array of comments.  
- `CommentDTO` includes comment information and the `task_id` it belongs to.  

