import type { MockResponseConfig } from '@wesflo/local-mock-api-utils';

import { isSafeScenarioFile } from './isSafeScenarioFile.js';

export const validateResponse = (value: MockResponseConfig, path: string): readonly string[] => {
    const invalidStatus =
        value.status !== undefined && (!Number.isInteger(value.status) || value.status < 100 || value.status > 599);
    const validFixedDelay = typeof value.delay === 'number' && Number.isInteger(value.delay) && value.delay >= 0;
    const validRange =
        Array.isArray(value.delay) &&
        value.delay.length === 2 &&
        value.delay.every((entry) => Number.isInteger(entry) && entry >= 0) &&
        value.delay[0] <= value.delay[1];
    const invalidDelay = value.delay !== undefined && !validFixedDelay && !validRange;
    const invalidFile = value.file !== undefined && (typeof value.file !== 'string' || !isSafeScenarioFile(value.file));

    return [
        ...(invalidStatus ? [`${path}.status: must be an integer from 100 through 599`] : []),
        ...(invalidDelay
            ? [`${path}.delay: must be a non-negative integer or an ascending [minimum, maximum] range`]
            : []),
        ...(invalidFile ? [`${path}.file: must be a safe path relative to mockRoot`] : []),
    ];
};
