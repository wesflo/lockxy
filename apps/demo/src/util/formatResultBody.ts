export const formatResultBody = (value: unknown): string => {
    if (value === null || value === undefined) {
        return '';
    }

    if (value instanceof Error) {
        return value.message;
    }

    if (typeof value === 'string') {
        return value;
    }

    return JSON.stringify(value, null, 2);
};
