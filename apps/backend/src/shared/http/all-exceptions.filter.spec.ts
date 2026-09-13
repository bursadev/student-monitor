import {
  type ArgumentsHost,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { AllExceptionsFilter } from './all-exceptions.filter.js';

/**
 * Captures what the filter actually writes to the response. The Express
 * response is the boundary here, so the payload it receives *is* the behaviour
 * under test.
 */
function makeHost(method = 'GET', url = '/api/me') {
  let body: unknown;
  let code: number | undefined;
  const res = {
    status(status: number) {
      code = status;
      return {
        json(payload: unknown) {
          body = payload;
        },
      };
    },
  };
  const host = {
    switchToHttp: () => ({ getResponse: () => res, getRequest: () => ({ method, url }) }),
  } as unknown as ArgumentsHost;

  return { host, sent: () => ({ status: code, body }) };
}

function prismaError(code: string) {
  return Object.assign(new Error(`Prisma said ${code}`), {
    name: 'PrismaClientKnownRequestError',
    code,
    clientVersion: '7.10.0',
  });
}

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    // The 500 path logs the real cause on purpose; keep the suite output clean.
    vi.spyOn(filter['logger'], 'error').mockImplementation(() => undefined);
  });

  it('keeps a Turkish message that a caller passed deliberately', () => {
    const { host, sent } = makeHost();

    filter.catch(new UnauthorizedException('Oturum açılmamış.'), host);

    expect(sent()).toEqual({ status: 401, body: { statusCode: 401, message: 'Oturum açılmamış.' } });
  });

  it("replaces Nest's English default with Turkish", () => {
    const { host, sent } = makeHost();

    filter.catch(new NotFoundException(), host);

    expect(sent()).toEqual({ status: 404, body: { statusCode: 404, message: 'Kayıt bulunamadı.' } });
  });

  it('translates the default for every status it is given', () => {
    const { host, sent } = makeHost();

    filter.catch(new ForbiddenException(), host);

    expect(sent().body).toEqual({ statusCode: 403, message: 'Bu işlem için yetkiniz yok.' });
  });

  it('falls back to Turkish rather than relaying English validation messages', () => {
    const { host, sent } = makeHost();

    filter.catch(new BadRequestException(['email must be an email', 'name should not be empty']), host);

    expect(sent().body).toEqual({ statusCode: 400, message: 'Geçersiz istek.' });
  });

  it('maps a Prisma missing-row error to a Turkish 404', () => {
    const { host, sent } = makeHost();

    filter.catch(prismaError('P2025'), host);

    expect(sent()).toEqual({ status: 404, body: { statusCode: 404, message: 'Kayıt bulunamadı.' } });
  });

  it('maps a Prisma unique-constraint error to a Turkish 409', () => {
    const { host, sent } = makeHost();

    filter.catch(prismaError('P2002'), host);

    expect(sent().body).toEqual({ statusCode: 409, message: 'Bu kayıt zaten var.' });
  });

  it('maps a Clerk 404 to a Turkish 404', () => {
    const { host, sent } = makeHost();

    filter.catch(Object.assign(new Error('Not Found'), { clerkError: true, status: 404 }), host);

    expect(sent().body).toEqual({ statusCode: 404, message: 'Kayıt bulunamadı.' });
  });

  it('never leaks the cause of an unexpected failure', () => {
    const { host, sent } = makeHost();

    filter.catch(new Error('connect ECONNREFUSED 10.0.0.4:5432 as user sm_admin'), host);

    expect(sent()).toEqual({
      status: 500,
      body: { statusCode: 500, message: 'Beklenmeyen bir hata oluştu.' },
    });
    expect(JSON.stringify(sent().body)).not.toContain('ECONNREFUSED');
    expect(JSON.stringify(sent().body)).not.toContain('sm_admin');
  });

  it('logs the real cause of a 500 so it is not lost', () => {
    const { host } = makeHost('POST', '/api/me');
    const logged = vi.spyOn(filter['logger'], 'error').mockImplementation(() => undefined);

    filter.catch(new Error('boom'), host);

    expect(logged.mock.calls[0]?.[0]).toContain('boom');
    expect(logged.mock.calls[0]?.[0]).toContain('POST /api/me');
  });

  it('does not log an ordinary 404 as a server error', () => {
    const { host } = makeHost();
    const logged = vi.spyOn(filter['logger'], 'error').mockImplementation(() => undefined);

    filter.catch(new NotFoundException(), host);

    expect(logged).not.toHaveBeenCalled();
  });
});
