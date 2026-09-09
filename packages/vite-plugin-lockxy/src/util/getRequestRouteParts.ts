import { decodePart } from './decodePart.js';
import { isSafePart } from './isSafePart.js';

export const getRequestRouteParts = (
    requestUrl: string | undefined,
    requestPrefixes: readonly string[]
): string[] | null => {
    if (!requestUrl) {
        return null;
    }

    const { pathname } = new URL(requestUrl, 'http://localhost');
    const matchingPrefix = requestPrefixes
        .filter((prefix) => pathname.startsWith(prefix))
        .sort((first, second) => second.length - first.length)[0];

    if (!matchingPrefix) {
        return null;
    }

    const mockParts = pathname.slice(matchingPrefix.length).split('/').filter(Boolean).map(decodePart);

    if (!mockParts.length || mockParts.some((part) => !part || !isSafePart(part))) {
        return null;
    }

    return mockParts as string[];
};
