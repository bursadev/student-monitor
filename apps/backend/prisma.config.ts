import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

// Prisma 7 reads the database URL from here rather than from schema.prisma.
// (`import 'dotenv/config'` would be shorter, but that subpath ships no type
// declarations, so it fails under moduleResolution: nodenext.)
config();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  // Read through process.env directly rather than Prisma's strict env() helper,
  // so `prisma generate` still succeeds during install before any .env exists.
  // Only `prisma migrate` needs a real connection string.
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgresql://placeholder',
  },
});
