import { MANIFEST_ROUTE } from '@wesflo/local-mock-api-utils';

import type { MockManifest } from '../interface';

export const loadManifest = async (
    request: typeof fetch = fetch,
    route: string = MANIFEST_ROUTE
): Promise<MockManifest> => {
    const response = await request(route);
    if (!response.ok) {
        throw new Error(`Manifest request failed with HTTP ${response.status}`);
    }

    return (await response.json()) as MockManifest;
};
