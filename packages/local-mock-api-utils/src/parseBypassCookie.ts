import { BYPASS_ALL_VALUE, ENDPOINT_ID_PATTERN } from './constant.js';

export interface BypassSelection {
    all: boolean;
    endpointIds: ReadonlySet<string>;
}

export const parseBypassCookie = (value?: string): BypassSelection => {
    const endpointIds = new Set<string>();

    if (value === BYPASS_ALL_VALUE) {
        return { all: true, endpointIds };
    }

    value?.split('|').forEach((endpointId) => {
        if (ENDPOINT_ID_PATTERN.test(endpointId)) {
            endpointIds.add(endpointId);
        }
    });

    return { all: false, endpointIds };
};
