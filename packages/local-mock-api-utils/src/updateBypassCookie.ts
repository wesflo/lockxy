import { parseBypassCookie } from './parseBypassCookie';

export const updateBypassCookie = (value: string | undefined, endpointId: string, bypass: boolean): string => {
    const selection = parseBypassCookie(value);
    const endpointIds = new Set(selection.endpointIds);

    if (bypass) {
        endpointIds.add(endpointId);
    } else {
        endpointIds.delete(endpointId);
    }

    return [...endpointIds].join('|');
};
