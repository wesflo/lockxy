import type { MockManifest } from './interface.js';

/**
 * Internal fix vars:
 */
export const SCENARIO_COOKIE_NAME = 'wesflo-mock-api-scenarios';

export const SCENARIO_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

export const EMPTY_MANIFEST: MockManifest = { endpoints: [] };
export const EXTENSIONS = ['.json', '.pdf', '.csv', '.txt', '.jpg', '.jpeg', '.png', '.webp'];

export const CONTENT_TYPES: Readonly<Record<string, string>> = {
    '.json': 'application/json; charset=utf-8',
    '.pdf': 'application/pdf',
    '.csv': 'text/csv; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp'
};

/**
 * plugin defaults
 */
export const INTERNAL_PREFIX = '/api/';

export const DEFAULT_MOCK_ROOT = new URL('../../../../../../mock/', import.meta.url);

export const MANIFEST_FILE_NAME = 'mock.manifest.json';

export const MANIFEST_ROUTE = '/_local-mock-api/manifest';
