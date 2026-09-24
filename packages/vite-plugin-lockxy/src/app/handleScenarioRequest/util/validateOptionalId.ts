import { ENDPOINT_ID_PATTERN } from '@wesflo/local-mock-api-utils';

import { validateOptionalText } from './validateOptionalText.js';

export const validateOptionalId = (value: unknown, path: string): readonly string[] => [
    ...validateOptionalText(value, path),
    ...(typeof value === 'string' && value.length > 0 && !ENDPOINT_ID_PATTERN.test(value)
        ? [`${path}: may contain only letters, numbers, underscores, and hyphens`]
        : []),
];
