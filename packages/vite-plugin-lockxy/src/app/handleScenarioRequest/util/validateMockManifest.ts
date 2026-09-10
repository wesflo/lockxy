import { stat } from 'node:fs/promises';
import { ENDPOINT_ID_PATTERN, toMethodArray } from '@wesflo/local-mock-api-utils';

import type { MockManifest, MockResponseConfig } from '../../../interface.js';
import { toMockUrl } from '../../../util/toMockUrl.js';
import { isSafeScenarioFile } from './isSafeScenarioFile.js';
import { createEndpointId } from './createEndpointId.js';
import { createScenarioId } from './createScenarioId.js';

const routeParts = (path: string): string[] => path.split('/').filter(Boolean);

const isOptionalParameter = (part: string | undefined): boolean => Boolean(part?.startsWith(':') && part.endsWith('?'));

const routesOverlap = (left: readonly string[], right: readonly string[], leftIndex = 0, rightIndex = 0): boolean => {
    if (leftIndex === left.length) {
        return right.slice(rightIndex).every(isOptionalParameter);
    }
    if (rightIndex === right.length) {
        return left.slice(leftIndex).every(isOptionalParameter);
    }

    const leftPart = left[leftIndex]!;
    const rightPart = right[rightIndex]!;
    if (isOptionalParameter(leftPart) && routesOverlap(left, right, leftIndex + 1, rightIndex)) {
        return true;
    }
    if (isOptionalParameter(rightPart) && routesOverlap(left, right, leftIndex, rightIndex + 1)) {
        return true;
    }

    const compatible = leftPart === rightPart || leftPart.startsWith(':') || rightPart.startsWith(':');
    return compatible && routesOverlap(left, right, leftIndex + 1, rightIndex + 1);
};

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

const methodsOverlap = (left: readonly string[], right: readonly string[]): boolean =>
    left.length === 0 || right.length === 0 || left.some((method) => right.includes(method));

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
    const routes: { methods: readonly string[]; parts: string[]; path: string }[] = [];

    validateResponse(manifest, fileName, issues);
    validateOptionalText(manifest.$schema, `${fileName}.$schema`, issues);
    validateOptionalId(manifest.id, `${fileName}.id`, issues);

    for (const [endpointIndex, endpoint] of (manifest.endpoints ?? []).entries()) {
        const path = `${fileName}.endpoints[${endpointIndex}]`;
        const id = endpoint.id ?? createEndpointId(endpoint.method, endpoint.path);

        validateResponse(endpoint, path, issues);
        validateOptionalId(endpoint.id, `${path}.id`, issues);
        validateOptionalText(endpoint.label, `${path}.label`, issues);
        validateMethods(endpoint.method, `${path}.method`, issues);
        if (endpoint.active !== undefined && typeof endpoint.active !== 'boolean') {
            issues.push(`${path}.active: must be a boolean`);
        }
        if (endpointIds.has(id)) {
            issues.push(`${path}.id: duplicate endpoint ID "${id}"`);
        }
        endpointIds.add(id);

        if (endpoint.active !== false) {
            const route = {
                methods: toMethodArray(endpoint.method).map((method) => method.toUpperCase()),
                parts: routeParts(endpoint.path),
                path,
            };
            const conflict = routes.find(
                (current) =>
                    routesOverlap(current.parts, route.parts) && methodsOverlap(current.methods, route.methods)
            );
            if (conflict) {
                issues.push(`${path}: route conflicts with ${conflict.path}`);
            }
            routes.push(route);
        }

        await validateReferencedFile(endpoint.file, path, mockRoot, issues);
        const scenarioIds = new Set<string>();
        for (const [scenarioIndex, scenario] of (endpoint.scenarios ?? []).entries()) {
            const scenarioPath = `${path}.scenarios[${scenarioIndex}]`;
            const scenarioId = scenario.id ?? createScenarioId(endpoint.path, scenarioIndex);
            validateResponse(scenario, scenarioPath, issues);
            validateOptionalId(scenario.id, `${scenarioPath}.id`, issues);
            validateOptionalText(scenario.label, `${scenarioPath}.label`, issues);
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
