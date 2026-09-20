export const validateOptionalText = (value: unknown, path: string): readonly string[] =>
    value !== undefined && (typeof value !== 'string' || value.length === 0)
        ? [`${path}: must be a non-empty string`]
        : [];
