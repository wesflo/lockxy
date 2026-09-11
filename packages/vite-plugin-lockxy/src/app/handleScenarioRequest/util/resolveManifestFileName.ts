import { extname } from 'node:path';

import { MANIFEST_FILE_EXTENSIONS } from '../../../constant.js';

export const resolveManifestFileName = (
    configuredFileName: string,
    fileIndex: ReadonlySet<string>
): string => {
    if (MANIFEST_FILE_EXTENSIONS.some((extension) => extension === extname(configuredFileName).toLowerCase())) {
        return configuredFileName;
    }

    if (fileIndex.has(configuredFileName)) {
        return configuredFileName;
    }

    return (
        MANIFEST_FILE_EXTENSIONS.map((extension) => `${configuredFileName}${extension}`).find((fileName) =>
            fileIndex.has(fileName)
        ) ?? `${configuredFileName}${MANIFEST_FILE_EXTENSIONS[0]}`
    );
};
