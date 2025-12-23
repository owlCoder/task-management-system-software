export type Result<T> = 
  | { success: true; data: T }
  | { success: false; status: number; message: string };