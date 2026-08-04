import { NextResponse } from 'next/server';

export class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Requested resource not found', details?: unknown) {
    super(message, 404, 'NOT_FOUND', details);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Invalid request parameters', details?: unknown) {
    super(message, 400, 'BAD_REQUEST', details);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends ApiError {
  constructor(message = 'CognoDB database operation failed', details?: unknown) {
    super(message, 500, 'DATABASE_ERROR', details);
    this.name = 'DatabaseError';
  }
}

export function handleApiError(error: unknown) {
  console.error('[API Error]:', error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          details: error.details ?? null,
        },
      },
      { status: error.statusCode }
    );
  }

  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code: 'INTERNAL_SERVER_ERROR',
        details: null,
      },
    },
    { status: 500 }
  );
}
