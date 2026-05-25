import type { Response } from 'express';

export function ok<T>(res: Response, data: T, status = 200) {
  return res.status(status).json(data);
}

export function fail(res: Response, message: string, status = 400) {
  return res.status(status).json({ message });
}

export function serverError(res: Response, error: unknown) {
  const message = error instanceof Error ? error.message : 'Server error';
  console.error(error);
  return res.status(500).json({ message });
}
