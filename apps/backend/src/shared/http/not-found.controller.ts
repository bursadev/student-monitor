import { All, Controller, NotFoundException } from '@nestjs/common';

import { Public } from '../auth/public.decorator.js';

/**
 * Answers anything that matched no route.
 *
 * Without it Express replies first with its own `Cannot GET /api/x` — English,
 * HTML, and the one response the global exception filter never sees. Throwing
 * here puts unknown paths back through the filter like every other failure.
 *
 * Public on purpose: an unknown path is a 404 with or without a token, and
 * requiring auth would only turn typos into confusing 401s.
 */
@Controller()
export class NotFoundController {
  @Public()
  @All('*path')
  notFound(): never {
    throw new NotFoundException();
  }
}
