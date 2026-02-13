// A custom error class to handle API responses cleanly
export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

// A central function to parse ANY error into a user-friendly string
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message; // "Invalid Party ID" (Clean API message)
  }
  
  if (error instanceof Error) {
    return error.message; // "Invalid JSON format" (Client-side validation)
  }
  
  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred. Please try again.';
}