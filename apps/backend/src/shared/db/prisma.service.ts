import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

import { PrismaClient } from '../../generated/prisma/client.js';

/**
 * The app's single Prisma client, backed by a pg Pool through the driver
 * adapter. Prisma 7 requires an adapter — the Rust query engine is gone.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly pool: pg.Pool;

  constructor() {
    // Fail loudly rather than letting pg fall back to the PGHOST/PGUSER env
    // chain, which surfaces as a confusing error on the first query instead of
    // at boot.
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set — see apps/backend/.env.example');
    }
    const pool = new pg.Pool({ connectionString });
    super({ adapter: new PrismaPg(pool) });
    this.pool = pool;
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    await this.pool.end();
  }
}
