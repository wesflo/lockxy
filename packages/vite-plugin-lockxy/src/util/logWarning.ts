export const logWarning = (enabled: boolean, message: string): void => {
    if (enabled) {
        console.warn(`[lockxy] ${message}`);
    }
};
