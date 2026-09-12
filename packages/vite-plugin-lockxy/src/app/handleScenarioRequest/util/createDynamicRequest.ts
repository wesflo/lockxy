import { Buffer } from 'node:buffer';
import type { IncomingMessage } from 'node:http';

export const createDynamicRequest = async (request: IncomingMessage): Promise<Request> => {
    const method = request.method?.toUpperCase() ?? 'GET';
    const headers = new Headers();
    Object.entries(request.headers).forEach(([name, value]) => {
        if (Array.isArray(value)) {
            value.forEach((entry) => headers.append(name, entry));
        } else if (value !== undefined) {
            headers.set(name, value);
        }
    });

    const chunks: Buffer[] = [];
    if (method !== 'GET' && method !== 'HEAD') {
        for await (const chunk of request) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
    }

    const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined;
    const origin = `http://${request.headers.host ?? 'localhost'}`;

    return new Request(new URL(request.url ?? '/', origin), { method, headers, body });
};
