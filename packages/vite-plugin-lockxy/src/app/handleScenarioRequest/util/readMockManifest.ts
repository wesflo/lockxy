import { readFile, stat } from 'node:fs/promises';

import type { ManifestReadResult, MockManifest } from '../../../runtimeInterface.js';
import type { ManifestModuleLoader } from '../../../interface.js';
import { toMockUrl } from '../../../util/toMockUrl.js';
import { normalizeMockManifest } from './normalizeMockManifest.js';
import { parseManifestContent } from './parseManifestContent.js';
import { validateDynamicManifestStructure } from './validateDynamicManifestStructure.js';
import { validateManifestStructure } from './validateManifestStructure.js';
import { validateMockManifest } from './validateMockManifest.js';

const getValidationIssues = (error: unknown): string[] => {
    if (!(error instanceof Error) || !error.message.startsWith('Invalid mock manifest:\n- ')) {
        throw error;
    }

    return error.message.slice('Invalid mock manifest:\n- '.length).split('\n- ');
};

export const readMockManifest = async (
    mockRoot: URL,
    manifestFileName: string,
    debug = false,
    loadManifestModule?: ManifestModuleLoader
): Promise<ManifestReadResult> => {
    try {
        const isDynamic = /\.[jt]s$/i.test(manifestFileName);
        const warnings: string[] = [];
        let manifest: MockManifest;
        if (isDynamic) {
            await stat(toMockUrl(manifestFileName, mockRoot));
            if (!loadManifestModule) {
                throw new TypeError(`${manifestFileName}: dynamic manifests require the Vite development server`);
            }
            const loaded = await loadManifestModule(manifestFileName);
            const exported = (loaded as { default?: unknown })?.default;
            manifest = validateDynamicManifestStructure(exported, manifestFileName);
        } else {
            const content = await readFile(toMockUrl(manifestFileName, mockRoot), 'utf8');
            const parsed = parseManifestContent(manifestFileName, content);
            manifest = validateManifestStructure(parsed, manifestFileName, (message) =>
                warnings.push(`Ignoring invalid endpoint: ${message}`)
            );
        }
        if (debug) {
            try {
                await validateMockManifest(manifest, manifestFileName, mockRoot);
            } catch (error) {
                const issues = getValidationIssues(error);
                const invalidEndpointIndexes = new Set<number>();
                const rootIssues: string[] = [];

                issues.forEach((issue) => {
                    const match = issue.match(/\.endpoints\[(\d+)\]/);
                    if (match) {
                        invalidEndpointIndexes.add(Number(match[1]));
                        warnings.push(`Ignoring invalid endpoint: ${issue}`);
                    } else {
                        rootIssues.push(issue);
                    }
                });

                if (rootIssues.length > 0) {
                    throw new TypeError(`Invalid mock manifest:\n- ${rootIssues.join('\n- ')}`);
                }

                manifest = {
                    ...manifest,
                    endpoints: manifest.endpoints?.filter((_, index) => !invalidEndpointIndexes.has(index)),
                };
            }
        }

        return {
            status: 'valid',
            manifest: normalizeMockManifest(manifest),
            ...(warnings.length > 0 ? { warnings } : {}),
        };
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { status: 'missing' };
        }

        return {
            status: 'invalid',
            error: error instanceof Error ? error : new Error(String(error)),
        };
    }
};
