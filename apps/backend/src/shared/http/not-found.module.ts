import { Module } from '@nestjs/common';

import { NotFoundController } from './not-found.controller.js';

/**
 * A catch-all only works if it is registered after every real route, and Nest
 * registers the root module's own controllers *before* those of its imports.
 * So this lives in a module of its own and must stay **last** in AppModule's
 * imports — anything imported after it would be shadowed.
 *
 * The e2e suite is the tripwire: move this earlier and the /api/me tests start
 * returning 404 instead of 401.
 */
@Module({
  controllers: [NotFoundController],
})
export class NotFoundModule {}
