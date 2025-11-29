export type TaskResponse<T> = {
    success: boolean;
    data?: T;
    statusCode: number;
    message?: string;
};