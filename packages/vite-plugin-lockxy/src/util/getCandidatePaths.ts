import { getExtension } from './getExtension.js';
import { prefixFileName } from './prefixFileName.js';

export const getCandidatePaths = (
    parts: readonly string[],
    method: string | undefined,
    extensions: readonly string[]
): string[] => {
    const basePaths = new Set<string>();
    const normalizedMethod = method?.toUpperCase();

    // 1. Specific route candidates:
    // inbox/templates/1101
    // templates/1101
    // 1101
    for (let i = 0; i < parts.length; i += 1) {
        basePaths.add(parts.slice(i).join('/'));
    }

    // 2. Parent/fallback candidates:
    // inbox/templates
    // templates
    // inbox
    for (let i = parts.length - 1; i > 0; i -= 1) {
        basePaths.add(parts.slice(0, i).join('/'));
        basePaths.add(parts[i - 1]!);
    }

    return [...basePaths].flatMap((basePath) => {
        const extension = getExtension(basePath);
        const paths = extension ? [basePath] : extensions.map((ext) => `${basePath}${ext}`);

        return paths.flatMap((path) => {
            if (!normalizedMethod) {
                return [path];
            }

            return [prefixFileName(path, normalizedMethod), path];
        });
    });
};
