import type { MockManifest, MockResponseSource } from './interface.js';

export const EMPTY_MANIFEST: MockManifest = {};
export const EXTENSIONS = ['.json', '.pdf', '.csv', '.txt', '.jpg', '.jpeg', '.png', '.webp'];

export const CONTENT_TYPES: Readonly<Record<string, string>> = {
    '.json': 'application/json; charset=utf-8',
    '.pdf': 'application/pdf',
    '.csv': 'text/csv; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
};

/**
 * plugin defaults
 */
export const REQUEST_PREFIXES = ['/api/'] as const;

export const DEFAULT_MOCK_ROOT = new URL('../../../../../../mock/', import.meta.url);

export const MANIFEST_FILE_NAME = 'mock.manifest.json';

export const DEBUG = false;

export const LOGGING = true;

export const LOG_COLORS = {
    primary: '\u001B[38;2;6;155;215m',
    success: '\u001B[38;2;22;160;93m',
    warning: '\u001B[38;2;231;123;18m',
    danger: '\u001B[38;2;180;35;24m',
    purple: '\u001B[38;2;139;92;246m',
    reset: '\u001B[0m',
} as const;

export const METHOD_LOG_COLORS: Readonly<Record<string, string>> = {
    GET: LOG_COLORS.primary,
    HEAD: LOG_COLORS.primary,
    POST: LOG_COLORS.success,
    PUT: LOG_COLORS.warning,
    PATCH: LOG_COLORS.purple,
    DELETE: LOG_COLORS.danger,
    OPTIONS: LOG_COLORS.purple,
};

export const RESPONSE_SOURCE_LABELS: Readonly<Record<MockResponseSource, string>> = {
    manifest: 'Manifest',
    cache: 'Cache',
    convention: 'Convention',
    passthrough: 'Passthrough',
    error: 'Error',
};
