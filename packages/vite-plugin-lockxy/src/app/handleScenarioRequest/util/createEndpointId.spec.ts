import { describe, expect, it } from 'vitest';

import { createEndpointId } from './createEndpointId.js';

describe('createEndpointId', () => {
    it('normalizes method and path into a cookie-safe ID', () => {
        expect(createEndpointId('GET', '/api/user profiles/:id')).toBe('get_api_user_profiles_id');
        expect(createEndpointId(undefined, '/')).toBe('any');
    });
});
