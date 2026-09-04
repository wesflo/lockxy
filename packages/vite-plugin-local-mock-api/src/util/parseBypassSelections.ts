import { BYPASS_COOKIE_NAME, parseBypassCookie } from '@wesflo/local-mock-api-utils';
import type { BypassSelections } from '../interface.js';

export const parseBypassSelections = (cookieHeader?: string): BypassSelections => {
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
        return parseBypassCookie(decodeURIComponent(cookie.slice(cookiePrefix.length)));
    } catch {
        return { all: false, endpointIds };
    }

    return { all: false, endpointIds };
};
