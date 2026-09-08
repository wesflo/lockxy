import { describe, expect, it } from 'vitest';

import { isSafeScenarioFile } from './isSafeScenarioFile.js';

describe('isSafeScenarioFile', () => {
    it.each(['response.json', 'scenarios/users/success.json', 'files/report.pdf'])(
        'accepts safe paths relative to mockRoot: %s',
        (path) => {
            expect(isSafeScenarioFile(path)).toBe(true);
        }
    );

    it.each([
        '',
        '/absolute.json',
        '../secret.json',
        'scenarios/../secret.json',
        './response.json',
        'scenarios//response.json',
        'scenarios\\response.json',
        'C:/response.json',
    ])('rejects unsafe or ambiguous paths: %s', (path) => {
        expect(isSafeScenarioFile(path)).toBe(false);
    });
});
