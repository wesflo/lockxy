const isParameter = (part: string): boolean => part.startsWith(':');
const isOptionalParameter = (part: string): boolean => isParameter(part) && part.endsWith('?');

export const matchManifestPath = (manifestPath: string, requestPath: string): boolean => {
    const manifestParts = manifestPath.split('/').filter(Boolean);
    const requestParts = requestPath.split('/').filter(Boolean);

    const matches = (manifestIndex: number, requestIndex: number): boolean => {
        if (manifestIndex === manifestParts.length) {
            return requestIndex === requestParts.length;
        }

        const manifestPart = manifestParts[manifestIndex]!;
        if (isOptionalParameter(manifestPart)) {
            return matches(manifestIndex + 1, requestIndex) ||
                (requestIndex < requestParts.length && matches(manifestIndex + 1, requestIndex + 1));
        }

        if (requestIndex >= requestParts.length) {
            return false;
        }

        return (isParameter(manifestPart) || manifestPart === requestParts[requestIndex]) &&
            matches(manifestIndex + 1, requestIndex + 1);
    };

    return matches(0, 0);
};
