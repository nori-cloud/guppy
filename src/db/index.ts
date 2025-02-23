import { env } from '@/system/env';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle({
  connection: {
    connectionString: env.Drizzle.DatabaseUrl,
    ssl: true
  }
});
