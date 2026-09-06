import { BYPASS_ALL_VALUE, BYPASS_COOKIE_NAME, ENDPOINT_ID_PATTERN, parseBypassCookie } from '@wesflo/local-mock-api-utils';
import type { BypassSelections } from '../interface.js';

export const parseBypassSelections = (cookieHeader?: string, onError?: (message: string) => void): BypassSelections => {
    const endpointIds = new Set<string>();

    if (!cookieHeader) {
        return { all: false, endpointIds };
    }

    const cookiePrefix = `${BYPASS_COOKIE_NAME}=`;
    const cookie = cookieHeader
        .split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith(cookiePrefix));

    if (!cookie) {
        return { all: false, endpointIds };
    }

    try {
        const value = decodeURIComponent(cookie.slice(cookiePrefix.length));
        if (
            value !== BYPASS_ALL_VALUE &&
            value.split('|').some((endpointId) => endpointId && !ENDPOINT_ID_PATTERN.test(endpointId))
        ) {
            onError?.('Ignoring malformed endpoint IDs in the bypass cookie.');
        }
        return parseBypassCookie(value);
    } catch {
        onError?.('Ignoring a bypass cookie that cannot be decoded.');
        return { all: false, endpointIds };
    }

    return { all: false, endpointIds };
};
