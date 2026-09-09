const toGeneratedId = (value: string): string =>
    value
        .trim()
        .toLocaleLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '') || 'mock';

export const createEndpointId = (method: string | undefined, path: string): string =>
    toGeneratedId(`${method ?? 'any'}_${path}`);
