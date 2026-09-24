import type { MockMethod } from '@wesflo/local-mock-api-utils';

import { validateOptionalText } from './validateOptionalText.js';

export const validateMethods = (value: MockMethod | undefined, path: string): readonly string[] => {
    const methods: readonly unknown[] = value === undefined ? [] : Array.isArray(value) ? value : [value];

    return [
        ...(Array.isArray(value) && value.length === 0 ? [`${path}: must contain at least one method`] : []),
        ...methods.flatMap((method, index) => {
            const methodPath = Array.isArray(value) ? `${path}[${index}]` : path;
            const duplicate =
                typeof method === 'string' &&
                methods
                    .slice(0, index)
                    .some(
                        (previousMethod) =>
                            typeof previousMethod === 'string' && previousMethod.toUpperCase() === method.toUpperCase()
                    );

            return [
                ...validateOptionalText(method, methodPath),
                ...(duplicate ? [`${methodPath}: duplicate method "${method}"`] : []),
            ];
        }),
    ];
};
