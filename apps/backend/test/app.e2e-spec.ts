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

  // Erasing an account is the most destructive thing the API can do, so the
  // default-deny guard covering it is worth its own assertion.
  it('rejects an unauthenticated account deletion', () => {
    return request(app.getHttpServer()).delete('/api/me').expect(401);
  });

  // Whatever the failure, the body is the same two fields and the copy is
  // Turkish. Nest's own shape would add an English `error` field here.
  it('answers a rejected request in Turkish, in one shape', () => {
    return request(app.getHttpServer())
      .get('/api/me')
      .expect(401)
      .expect({ statusCode: 401, message: 'Oturum açılmamış.' });
  });

  it('answers an unknown route in Turkish rather than "Cannot GET"', () => {
    return request(app.getHttpServer())
      .get('/api/kayip-yol')
      .expect(404)
      .expect({ statusCode: 404, message: 'Kayıt bulunamadı.' });
  });

  it('rejects an unauthenticated onboarding submission', () => {
    return request(app.getHttpServer())
      .post('/api/me/onboarding')
      .send({ role: 'STUDENT', displayName: 'Ada' })
      .expect(401)
      .expect({ statusCode: 401, message: 'Oturum açılmamış.' });
  });

  afterEach(async () => {
    await app.close();
  });
});
