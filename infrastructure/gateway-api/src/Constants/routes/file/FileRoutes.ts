export const FILE_ROUTES = {
    DOWNLOAD: (fileId: number) => `/files/download/${fileId}`,
    GET_BY_AUTHOR: (authorId: number) => `/files/author/${authorId}`,
    METADATA: (fileId: number) => `/files/metadata/${fileId}`,
    UPLOAD: "/files/upload",
    DELETE: (fileId: number) => `/files/${fileId}`
}