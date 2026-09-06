import { decodePart } from './decodePart.js';
import { isSafePart } from './isSafePart.js';

export const getInternalRouteParts = (requestUrl: string | undefined, internalPrefix: string): string[] | null => {
    if (!requestUrl) {
        return null;
    }

    const { pathname } = new URL(requestUrl, 'http://localhost');

    if (!pathname.startsWith(internalPrefix)) {
        return null;
    }

    const mockParts = pathname.slice(internalPrefix.length).split('/').filter(Boolean).map(decodePart);

    if (!mockParts.length || mockParts.some((part) => !part || !isSafePart(part))) {
        return null;
    }

    return mockParts as string[];
};
