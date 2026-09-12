export const getManifestPathParams = (
    manifestPath: string,
    requestPath: string
): Readonly<Record<string, string>> => {
    const manifestParts = manifestPath.split('/').filter(Boolean);
    const requestParts = requestPath.split('/').filter(Boolean);
    const extract = (
        manifestIndex: number,
        requestIndex: number,
        params: Record<string, string>
    ): Record<string, string> | undefined => {
        if (manifestIndex === manifestParts.length) {
            return requestIndex === requestParts.length ? params : undefined;
        }

        const part = manifestParts[manifestIndex]!;
        const parameter = part.startsWith(':');
        const optional = parameter && part.endsWith('?');
        if (optional) {
            const skipped = extract(manifestIndex + 1, requestIndex, { ...params });
            if (skipped) {
                return skipped;
            }
        }

        const value = requestParts[requestIndex];
        if (value === undefined || (!parameter && part !== value)) {
            return undefined;
        }

        const nextParams = { ...params };
        if (parameter) {
            nextParams[part.slice(1).replace(/\?$/, '')] = decodeURIComponent(value);
        }
        return extract(manifestIndex + 1, requestIndex + 1, nextParams);
    };

    return extract(0, 0, {}) ?? {};
};
