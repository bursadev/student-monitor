import type { AppUser } from '../src/generated/prisma/client.js';
import type { PrismaService } from '../src/shared/db/prisma.service.js';

type Where = { clerkUserId?: string; id?: string; onboardedAt?: Date | null };

function matches(row: AppUser, where: Where): boolean {
  if (where.clerkUserId !== undefined && row.clerkUserId !== where.clerkUserId) return false;
  if (where.id !== undefined && row.id !== where.id) return false;
  if (where.onboardedAt === null && row.onboardedAt !== null) return false;
  return true;
}

/**
 * A stand-in for the `appUser` delegate.
 *
 * Hand-rolled rather than mocked because these tests assert what the row looks
 * like afterwards, not which Prisma methods were called. Only the operations
 * our services actually use exist — anything else should fail loudly rather
 * than quietly return undefined.
 */
export function makePrisma(rows: AppUser[] = []) {
  const findUnique = async ({ where }: { where: Where }) =>
    rows.find((r) => matches(r, where)) ?? null;

  return {
    rows,
    appUser: {
      findUnique,

      update: async ({ where, data }: { where: Where; data: Partial<AppUser> }) => {
        const row = await findUnique({ where });
        if (!row) throw new Error('row not found');
        Object.assign(row, data, { updatedAt: new Date() });
        return row;
      },

      updateMany: async ({ where, data }: { where: Where; data: Partial<AppUser> }) => {
        const affected = rows.filter((r) => matches(r, where));
        for (const row of affected) Object.assign(row, data, { updatedAt: new Date() });
        return { count: affected.length };
      },

      create: async ({ data }: { data: Partial<AppUser> }) => {
        const row: AppUser = {
          id: `app_${rows.length + 1}`,
          clerkUserId: '',
          email: null,
          displayName: null,
          role: null,
          onboardedAt: null,
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data,
        };
        rows.push(row);
        return row;
      },
    },
  };
}

export type PrismaFake = ReturnType<typeof makePrisma>;

export function asPrismaService(fake: PrismaFake): PrismaService {
  return fake as unknown as PrismaService;
}

export function makeAppUser(overrides: Partial<AppUser> = {}): AppUser {
  return {
    id: 'app_1',
    clerkUserId: 'user_ada',
    email: 'ada@example.com',
    displayName: 'Ada Yılmaz',
    role: null,
    onboardedAt: null,
    deletedAt: null,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  };
}
