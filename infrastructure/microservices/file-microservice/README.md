# File Microservice

A microservice responsible for file storage and retrieval operations.

## Features

- Upload files with metadata storage
- Download files by ID
- Delete files (both metadata and physical file)
- Retrieve files by author
- Get file metadata without downloading

## API Endpoints

- `POST /api/files/upload` - Upload a file
- `GET /api/files/download/:fileId` - Download a file
- `DELETE /api/files/:fileId` - Delete a file
- `GET /api/files/author/:authorId` - Get all files by author
- `GET /api/files/metadata/:fileId` - Get file metadata
- `GET /health` - Health check

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure
3. Start development: `npm run dev`
4. Build: `npm run build`
5. Start production: `npm start`

## File Storage

Files are stored in `Data/{user_uuid}/` directory structure with unique filenames (GUID).