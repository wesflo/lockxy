import { CONTENT_TYPES } from '../constant.js';

export const getContentType = (extension: string): string =>
    CONTENT_TYPES[extension] || 'application/octet-stream';
