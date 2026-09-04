import type { DemoCase, DemoResult } from '../interface';
import { formatValue } from '@wesflo/local-mock-api-utils';

export const executeDemoCase = async (testCase: DemoCase): Promise<DemoResult> => {
    const startedAt = performance.now();
    const init: RequestInit = {
        method: testCase.method,
        ...(testCase.body === undefined ? {} : { body: JSON.stringify(testCase.body) }),
    };

    try {
        const response = await fetch(testCase.path, init);
        const blob = testCase.responseKind === 'blob' ? await response.blob() : undefined;
        const value =
            testCase.responseKind === 'json' && response.status !== 204
                ? await response.json()
                : testCase.responseKind === 'text' && response.status !== 204
                  ? await response.text()
                  : undefined;
        const disposition = response.headers.get('content-disposition');
        const filename = disposition?.match(/filename="?([^";]+)"?/i)?.[1];

        return {
            state: response.status === testCase.expectedStatus ? 'success' : 'error',
            status: response.status,
            statusText: response.statusText,
            duration: performance.now() - startedAt,
            body: blob ? `${blob.type || 'Datei'} (${blob.size} Bytes)` : formatValue(value),
            contentType: response.headers.get('content-type') ?? '–',
            headers: [...response.headers.entries()],
            blob,
            filename,
        };
    } catch (error) {
        const message = formatValue(error);

        return {
            state: 'error',
            status: 0,
            statusText: 'Request failed',
            duration: performance.now() - startedAt,
            body: message,
            contentType: '–',
            headers: [],
            error: message,
        };
    }
};
