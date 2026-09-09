export const logDebug = (enabled: boolean, message: string): void => {
    if (enabled) {
        console.debug(`[lockxy] ${message}`);
    }
};
