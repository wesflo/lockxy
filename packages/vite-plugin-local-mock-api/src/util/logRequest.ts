import type { RequestLogDetails } from '../interface.js';

export const logRequest = (enabled: boolean, details: RequestLogDetails): void => {
    if (!enabled) {
        return;
    }

    console.info(
        `[local-mock-api] ${details.method} ${details.url} -> ${details.status}; ` +
            `delay=${details.delay}ms; source=${details.source}`
    );
};
