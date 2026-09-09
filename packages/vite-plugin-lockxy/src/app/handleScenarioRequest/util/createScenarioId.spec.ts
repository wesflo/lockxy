import { describe, expect, it } from 'vitest';

import { createScenarioId } from './createScenarioId.js';

describe('createScenarioId', () => {
    it('normalizes the path and one-based scenario position', () => {
        expect(createScenarioId('/api/user profiles', 0)).toBe('api_user_profiles_1');
        expect(createScenarioId('/', 1)).toBe('2');
    });
});
