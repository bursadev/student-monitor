import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route as not requiring a Clerk bearer token. The guard is global, so
 * this is the only way out — which is deliberate: a new endpoint is protected
 * unless someone explicitly opts it out in the diff.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
