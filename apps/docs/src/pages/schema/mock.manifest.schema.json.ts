import schema from '../../../../../packages/vite-plugin-local-mock-api/mock.manifest.schema.json';

export const prerender = true;

export const GET = (): Response =>
    new Response(JSON.stringify(schema, null, 2), {
        headers: { 'content-type': 'application/schema+json; charset=utf-8' }
    });
