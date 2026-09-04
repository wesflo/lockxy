import { INTERNAL_PREFIX } from '../constant.js';
import { decodePart } from './decodePart.js';
import { isSafePart } from './isSafePart.js';

export const getInternalRouteParts = (requestUrl?: string): string[] | null => {
    if (!requestUrl) {
        return null;
    }

    const { pathname } = new URL(requestUrl, 'http://localhost');

    if (!pathname.startsWith(INTERNAL_PREFIX)) {
        return null;
    }

    const mockParts = pathname.slice(INTERNAL_PREFIX.length).split('/').filter(Boolean).map(decodePart);

    if (!mockParts.length || mockParts.some((part) => !part || !isSafePart(part))) {
        return null;
    }

    return mockParts as string[];
};
