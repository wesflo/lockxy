export const logError = (enabled: boolean, message: string, error?: unknown): void => {
    if (!enabled) {
        return;
    }

    if (error === undefined) {
        console.error(`[lockxy] ${message}`);
        return;
    }

    console.error(`[lockxy] ${message}`, error);
};
