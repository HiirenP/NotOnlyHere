import 'reflect-metadata';
import { config } from 'dotenv';
import { resolve } from 'node:path';

config({ path: resolve(__dirname, '../../../.env') });

process.env.PHASE0_DEV_AUTH ??= 'true';
process.env.DATABASE_URL ??=
  'postgresql://notonlyhere:notonlyhere@localhost:5432/notonlyhere';
