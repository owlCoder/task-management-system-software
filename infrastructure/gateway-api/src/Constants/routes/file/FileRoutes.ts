export const FILE_ROUTES = Object.freeze({
    DOWNLOAD_FILE: (fileId: number) => `/files/download/${fileId}`,
    GET_FILES_FROM_AUTHOR: (authorId: number) => `/files/author/${authorId}`,
    GET_FILE_METADATA: (fileId: number) => `/files/metadata/${fileId}`,
    UPLOAD_FILE: "/files/upload",
    DELETE_FILE: (fileId: number) => `/files/${fileId}`
} as const);