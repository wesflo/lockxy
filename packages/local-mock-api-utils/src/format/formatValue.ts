export const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) {
        return '';
    }

    if (value instanceof Error) {
        return value.message;
    }

    return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
};
