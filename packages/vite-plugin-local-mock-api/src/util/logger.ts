import type { RequestLogDetails } from '../interface.js';

const PREFIX = '[local-mock-api]';

export const logRequest = (enabled: boolean, details: RequestLogDetails): void => {
    if (!enabled) {
        return;
    }

    console.info(
        `${PREFIX} ${details.method} ${details.url} -> ${details.status}; ` +
            `delay=${details.delay}ms; source=${details.source}`
    );
};

export const logError = (enabled: boolean, message: string, error?: unknown): void => {
    if (!enabled) {
        return;
    }

    if (error === undefined) {
        console.error(`${PREFIX} ${message}`);
        return;
    }

    console.error(`${PREFIX} ${message}`, error);
};

export const logDebug = (enabled: boolean, message: string): void => {
    if (enabled) {
        console.debug(`${PREFIX} ${message}`);
    }
};
