import { Test, type TestingModule } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';

import { AppModule } from './../src/app.module.js';

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('health is public', () => {
    return request(app.getHttpServer()).get('/api/health').expect(200).expect({ status: 'ok' });
  });

  // The guard is global and default-deny: a route with no @Public() must reject
  // an unauthenticated caller. This is the test that fails loudly if someone
  // ever removes APP_GUARD.
  it('rejects an unauthenticated request to /api/me', () => {
    return request(app.getHttpServer()).get('/api/me').expect(401);
  });

  it('rejects a malformed bearer token', () => {
    return request(app.getHttpServer())
      .get('/api/me')
      .set('Authorization', 'Bearer not-a-real-token')
      .expect(401);
  });

  afterEach(async () => {
    await app.close();
  });
});
