import { describe, expect, it, vi } from 'vitest';

import { parseScenarioSelections } from './parseScenarioSelections.js';

describe('parseScenarioSelections', () => {
    it('reports corrupt and malformed cookie values without throwing', () => {
        const onError = vi.fn();

        expect(
            parseScenarioSelections(
                'wesflo-mock-api-scenarios=users%3Asuccess%7Cinvalid%3Avalue%3Aextra',
                onError
            )
        ).toEqual(new Map([['users', 'success']]));
        expect(onError).toHaveBeenCalledWith('Ignoring a malformed scenario selection cookie entry.');

        expect(parseScenarioSelections('wesflo-mock-api-scenarios=%E0%A4%A', onError)).toEqual(new Map());
        expect(onError).toHaveBeenCalledWith('Ignoring a scenario selection cookie that cannot be decoded.');
    });
});
