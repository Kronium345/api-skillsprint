import cors, { type CorsOptions } from 'cors';

const allowedOrigins = [
  'http://localhost:8081',
  'http://localhost:19006',
  'http://127.0.0.1:8081',
  'exp://localhost:8081',
];

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('exp://')) {
      callback(null, true);
      return;
    }
    callback(null, true);
  },
  credentials: true,
};

export const corsMiddleware = cors(corsOptions);
