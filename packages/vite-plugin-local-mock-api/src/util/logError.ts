export const logError = (enabled: boolean, message: string, error?: unknown): void => {
    if (!enabled) {
        return;
    }

    if (error === undefined) {
        console.error(`[local-mock-api] ${message}`);
        return;
    }

    console.error(`[local-mock-api] ${message}`, error);
};
