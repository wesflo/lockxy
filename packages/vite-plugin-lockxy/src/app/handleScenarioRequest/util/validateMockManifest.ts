import { stat } from 'node:fs/promises';
import { ENDPOINT_ID_PATTERN, toMethodArray } from '@wesflo/local-mock-api-utils';

import type { MockManifest, MockResponseConfig } from '../../../runtimeInterface.js';
import { toMockUrl } from '../../../util/toMockUrl.js';
import { isSafeScenarioFile } from './isSafeScenarioFile.js';
import { createScenarioId } from './createScenarioId.js';

const validateResponse = (value: MockResponseConfig, path: string, issues: string[]): void => {
    if (value.status !== undefined && (!Number.isInteger(value.status) || value.status < 100 || value.status > 599)) {
        issues.push(`${path}.status: must be an integer from 100 through 599`);
    }

    if (value.delay !== undefined) {
        const validFixedDelay = typeof value.delay === 'number' && Number.isInteger(value.delay) && value.delay >= 0;
        const validRange =
            Array.isArray(value.delay) &&
            value.delay.length === 2 &&
            value.delay.every((entry) => Number.isInteger(entry) && entry >= 0) &&
            value.delay[0] <= value.delay[1];
        if (!validFixedDelay && !validRange) {
            issues.push(`${path}.delay: must be a non-negative integer or an ascending [minimum, maximum] range`);
        }
    }

    if (value.file !== undefined && (typeof value.file !== 'string' || !isSafeScenarioFile(value.file))) {
        issues.push(`${path}.file: must be a safe path relative to mockRoot`);
    }
};

const validateOptionalText = (value: unknown, path: string, issues: string[]): void => {
    if (value !== undefined && (typeof value !== 'string' || value.length === 0)) {
        issues.push(`${path}: must be a non-empty string`);
    }
};

const validateOptionalId = (value: unknown, path: string, issues: string[]): void => {
    validateOptionalText(value, path, issues);
    if (typeof value === 'string' && value.length > 0 && !ENDPOINT_ID_PATTERN.test(value)) {
        issues.push(`${path}: may contain only letters, numbers, underscores, and hyphens`);
    }
};

const validateMethods = (value: string | readonly string[] | undefined, path: string, issues: string[]): void => {
    const methods = toMethodArray(value);
    const normalizedMethods = new Set<string>();

    if (Array.isArray(value) && value.length === 0) {
        issues.push(`${path}: must contain at least one method`);
    }

    methods.forEach((method, index) => {
        const methodPath = Array.isArray(value) ? `${path}[${index}]` : path;
        validateOptionalText(method, methodPath, issues);
        const normalizedMethod = method.toUpperCase();
        if (normalizedMethods.has(normalizedMethod)) {
            issues.push(`${methodPath}: duplicate method "${method}"`);
        }
        normalizedMethods.add(normalizedMethod);
    });
};

const validateReferencedFile = async (
    file: string | undefined,
    path: string,
    mockRoot: URL,
    issues: string[]
): Promise<void> => {
    if (!file || !isSafeScenarioFile(file)) {
        return;
    }

    try {
        const fileStats = await stat(toMockUrl(file, mockRoot));
        if (!fileStats.isFile()) {
            throw new TypeError('not a file');
        }
    } catch {
        issues.push(`${path}.file: referenced file "${file}" does not exist or is not a file`);
    }
};

export const validateMockManifest = async (manifest: MockManifest, fileName: string, mockRoot: URL): Promise<void> => {
    const issues: string[] = [];
    const endpointIds = new Set<string>();

    validateResponse(manifest, fileName, issues);
    validateOptionalText(manifest.$schema, `${fileName}.$schema`, issues);
    validateOptionalId(manifest.id, `${fileName}.id`, issues);
    if (manifest.preventMock !== undefined && typeof manifest.preventMock !== 'boolean') {
        issues.push(`${fileName}.preventMock: must be a boolean`);
    }

    for (const [endpointIndex, endpoint] of (manifest.endpoints ?? []).entries()) {
        const path = `${fileName}.endpoints[${endpointIndex}]`;

        validateResponse(endpoint, path, issues);
        validateOptionalId(endpoint.id, `${path}.id`, issues);
        validateOptionalText(endpoint.label, `${path}.label`, issues);
        validateMethods(endpoint.method, `${path}.method`, issues);
        if ('active' in endpoint) {
            issues.push(`${path}.active: is not supported on endpoints; use preventMock instead`);
        }
        if (endpoint.preventMock !== undefined && typeof endpoint.preventMock !== 'boolean') {
            issues.push(`${path}.preventMock: must be a boolean`);
        }
        if (endpoint.id && endpointIds.has(endpoint.id)) {
            issues.push(`${path}.id: duplicate endpoint ID "${endpoint.id}"`);
        }
        if (endpoint.id) {
            endpointIds.add(endpoint.id);
        }

        await validateReferencedFile(endpoint.file, path, mockRoot, issues);
        const scenarioIds = new Set<string>();
        for (const [scenarioIndex, scenario] of (endpoint.scenarios ?? []).entries()) {
            const scenarioPath = `${path}.scenarios[${scenarioIndex}]`;
            const scenarioId = scenario.id ?? createScenarioId(endpoint.path, scenarioIndex);
            validateResponse(scenario, scenarioPath, issues);
            validateOptionalId(scenario.id, `${scenarioPath}.id`, issues);
            validateOptionalText(scenario.label, `${scenarioPath}.label`, issues);
            if (scenario.active !== undefined && typeof scenario.active !== 'boolean') {
                issues.push(`${scenarioPath}.active: must be a boolean`);
            }
            if (scenarioIds.has(scenarioId)) {
                issues.push(`${scenarioPath}.id: duplicate scenario ID "${scenarioId}"`);
            }
            scenarioIds.add(scenarioId);
            await validateReferencedFile(scenario.file, scenarioPath, mockRoot, issues);
        }
    }

    if (issues.length > 0) {
        throw new TypeError(`Invalid mock manifest:\n- ${issues.join('\n- ')}`);
    }
};
