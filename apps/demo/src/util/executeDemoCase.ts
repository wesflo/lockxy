import { epFetch, epFetchBlob, epFetchText } from '@electronicpartnerio/ui-utils';

import type { DemoCase, DemoResult } from '../interface';
import { formatResultBody } from './formatResultBody';

export const executeDemoCase = async (testCase: DemoCase): Promise<DemoResult> => {
    const startedAt = performance.now();
    const init: RequestInit = {
        method: testCase.method,
        ...(testCase.body === undefined ? {} : { body: JSON.stringify(testCase.body) })
    };

    try {
        if (testCase.responseKind === 'blob') {
            const response = await epFetchBlob('')(testCase.path, init);

            return {
                state: 'success',
                duration: performance.now() - startedAt,
                body: response ? `PDF (${response.blob.size} Bytes)` : '',
                blob: response?.blob,
                filename: response?.filename
            };
        }

        const response =
            testCase.responseKind === 'text'
                ? await epFetchText('')(testCase.path, init)
                : await epFetch<unknown>('')(testCase.path, init);

        return {
            state: 'success',
            duration: performance.now() - startedAt,
            body: formatResultBody(response)
        };
    } catch (error) {
        const message = formatResultBody(error);

        return {
            state: 'error',
            duration: performance.now() - startedAt,
            body: message,
            error: message
        };
    }
};
