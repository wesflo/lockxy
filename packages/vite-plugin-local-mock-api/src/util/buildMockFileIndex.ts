import { readdir } from 'node:fs/promises';
import { join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const collectFiles = async (directory: string, relativeDirectory: string, index: Set<string>): Promise<void> => {
    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
        const relativePath = relativeDirectory ? posix.join(relativeDirectory, entry.name) : entry.name;
        const absolutePath = join(directory, entry.name);

        if (entry.isDirectory()) {
            await collectFiles(absolutePath, relativePath, index);
        } else if (entry.isFile()) {
            index.add(relativePath);
        }
    }
};

export const buildMockFileIndex = async (mockRoot: URL): Promise<ReadonlySet<string>> => {
    const index = new Set<string>();

    try {
        await collectFiles(fileURLToPath(mockRoot), '', index);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            throw error;
        }
    }

    return index;
};
