const toGeneratedId = (value: string): string =>
    value
        .trim()
        .toLocaleLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '') || 'mock';

export const createScenarioId = (endpointPath: string, index: number): string =>
    toGeneratedId(`${endpointPath}_${index + 1}`);
