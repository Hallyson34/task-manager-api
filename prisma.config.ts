import { defineConfig } from 'prisma/config';
import 'dotenv/config';
import path from 'path';

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
    seed: 'node prisma/seed.js',
  },
});
