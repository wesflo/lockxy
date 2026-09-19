import { extname } from 'node:path';
import { parseDocument } from 'yaml';

import { formatJsonError } from './formatJsonError.js';

export const parseManifestContent = (fileName: string, content: string): unknown => {
    const extension = extname(fileName).toLowerCase();

    if (extension !== '.yaml' && extension !== '.yml') {
        try {
            return JSON.parse(content);
        } catch (error) {
            throw formatJsonError(fileName, content, error);
        }
    }

    try {
        const document = parseDocument(content, {
            customTags: [],
            prettyErrors: true,
            schema: 'core',
            uniqueKeys: true,
        });

        const issue = document.errors[0] ?? document.warnings[0];
        if (issue) {
            throw issue;
        }

        return document.toJS({ maxAliasCount: 100 });
    } catch (error) {
        throw new Error(`${fileName}: Invalid YAML: ${error instanceof Error ? error.message : String(error)}`);
    }
};
