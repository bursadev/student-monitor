import { Test, type TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

describe('UsersController', () => {
  let controller: UsersController;
  let users: {
    ensureAndGet: ReturnType<typeof vi.fn>;
    deleteAccount: ReturnType<typeof vi.fn>;
    completeOnboarding: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    users = {
      ensureAndGet: vi.fn(),
      deleteAccount: vi.fn(async () => undefined),
      completeOnboarding: vi.fn(async () => ({ id: 'app_1' })),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: users }],
    }).compile();

    controller = module.get(UsersController);
  });

  it('deletes the account of the caller, never an id from the request', async () => {
    await controller.delete('user_ada');

    expect(users.deleteAccount).toHaveBeenCalledWith('user_ada');
  });

  it('onboards the caller, passing the body through for validation', async () => {
    const body = { role: 'STUDENT', displayName: 'Ada Yılmaz' };

    await controller.onboard('user_ada', body);

    // The subject comes from the token, never the body — a caller cannot
    // onboard somebody else by naming them.
    expect(users.completeOnboarding).toHaveBeenCalledWith('user_ada', body);
  });
});
