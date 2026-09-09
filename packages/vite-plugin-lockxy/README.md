<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/wesflo/lockxy/main/assets/brand/lockxy-lockup-on-dark.svg">
    <img src="https://raw.githubusercontent.com/wesflo/lockxy/main/assets/brand/lockxy-lockup-on-light.svg" alt="Lockxy — Local Mock Proxy" width="360">
</picture>

# @wesflo/vite-plugin-lockxy

A plug-and-play Vite plugin for serving local API mocks through file naming conventions. A manifest is optional and adds scenarios, status codes, delays, and other per-route behavior when needed.

## Installation

With pnpm:

```sh
pnpm add --save-dev @wesflo/vite-plugin-lockxy
```

With npm:

```sh
npm install --save-dev @wesflo/vite-plugin-lockxy
```

With Yarn:

```sh
yarn add --dev @wesflo/vite-plugin-lockxy
```

## Minimal setup

```ts
import { defineConfig } from 'vite';
import lockxy from '@wesflo/vite-plugin-lockxy';

export default defineConfig(({ command }) => ({
    plugins: command === 'serve' ? [lockxy()] : [],
}));
```

Add a JSON file below `mock/` and request the matching URL from the Vite development server. For example, `mock/users/profile.json` handles `GET /api/users/profile`, while `mock/users/POST_profile.json` handles `POST /api/users/profile` with the default request prefix.

## Plugin configuration

Every option is optional. This example shows the complete configuration surface with its defaults and one additional file type:

```ts
lockxy({
    mockRoot: new URL('./mock/', import.meta.url),
    requestPrefixes: ['/api/'],
    extensions: ['.xml'],
    contentTypes: {
        '.xml': 'application/xml; charset=utf-8',
    },
    manifestFileName: 'mock.manifest.json',
    debug: false,
    logging: true,
});
```

| Option | Type | Default | Purpose |
| --- | --- | --- | --- |
| `mockRoot` | `URL` | Project `mock/` directory | Contains convention files and the optional manifest. |
| `requestPrefixes` | `string \| readonly string[]` | `'/api/'` | Local URL namespaces handled by Lockxy. |
| `extensions` | `readonly string[]` | `[]` | Adds file extensions after the built-in JSON, PDF, CSV, text, JPEG, PNG, and WebP candidates. |
| `contentTypes` | `Readonly<Record<string, string>>` | `{}` | Adds or overrides extension-to-content-type mappings. |
| `manifestFileName` | `string` | `'mock.manifest.json'` | Manifest filename inside `mockRoot`. |
| `debug` | `boolean` | `false` | Enables detailed manifest, route, status, delay, ID, and referenced-file validation. |
| `logging` | `boolean` | `true` | Logs handled requests and runtime errors. |

The manifest HTTP route is intentionally fixed at `/_local-mock-api/manifest` and cannot be changed through plugin options.

### Naming conventions and precedence

The request prefix is removed before Lockxy searches below `mockRoot`. For `PUT /api/users/profile`, JSON candidates are checked in this order:

```text
mock/users/PUT_profile.json
mock/users/profile.json
mock/PUT_profile.json
mock/profile.json
```

This means nested, method-specific files win first. Nesting and method prefixes are both optional. The same resolution is repeated in the configured extension order, followed by parent fallbacks for longer routes.

| Request | Preferred file | Generic fallback |
| --- | --- | --- |
| `GET /api/users/profile` | `mock/users/GET_profile.json` | `mock/users/profile.json` |
| `POST /api/users/profile` | `mock/users/POST_profile.json` | `mock/users/profile.json` |
| `GET /api/reports/monthly` | `mock/reports/GET_monthly.pdf` | `mock/reports/monthly.pdf` |

### Multiple request prefixes

Use `requestPrefixes` when the local application exposes more than one API namespace:

```ts
lockxy({
    requestPrefixes: ['/api/', '/development-api/'],
});
```

For one namespace, a string is enough: `requestPrefixes: '/api/'`.

The matched prefix is removed before file resolution, so `/development-api/users` can resolve to `mock/users.json`. A Vite `server.proxy` entry can forward intentionally bypassed requests from that local prefix to any remote development API. Requests without a matching mock continue to return `404`; they reach the proxy only through an endpoint or global bypass.

## Optional manifest

`mock.manifest.json` is not required. Convention-only projects remain fully functional when it is missing. Add it only for calls that need an explicit file, status, delay, failure, dynamic route, or multiple selectable scenarios; every other request continues to use naming conventions.

The package includes a JSON Schema for editor autocomplete and inline validation:

```json
{
    "$schema": "../node_modules/@wesflo/vite-plugin-lockxy/mock.manifest.schema.json",
    "id": "shop-frontend",
    "delay": 400
}
```

A root-level delay is already a complete manifest and applies to all mocked requests. Use `[200, 600]` instead of `400` to choose a new inclusive random delay for every request.

Endpoint entries require only `path`. `method`, `id`, `label`, `active`, `file`, `status`, `delay`, and `scenarios` are optional:

```json
{
    "endpoints": [
        {
            "path": "/api/health",
            "status": 204
        },
        {
            "path": "/api/demo/json",
            "file": "scenarios/explicit.json",
            "delay": [200, 600]
        },
        {
            "id": "user-profile",
            "label": "User profile",
            "method": "GET",
            "path": "/api/users/:id",
            "scenarios": [
                {
                    "id": "success",
                    "label": "Successful response",
                    "status": 200,
                    "file": "scenarios/user-success.json"
                },
                {
                    "id": "not-found",
                    "label": "404 Not Found",
                    "status": 404,
                    "file": "scenarios/user-not-found.json"
                }
            ]
        }
    ]
}
```

The optional root `id` namespaces panel selections in local storage. Define a stable ID when a project uses the panel's “Save selections” setting.

An omitted endpoint `method` matches every method. An omitted `file` falls back to naming conventions. Required dynamic segments use `:id`; append `?`, as in `/api/cart/:id?`, to match the segment both when present and absent. A single scenario is selected automatically; multiple scenarios can be selected through the optional panel or scenario cookie. Selected scenario values override endpoint values, endpoint values override the root delay, and remaining file lookup follows naming conventions. Responses with status `204` or `304`, as well as all `HEAD` responses, never include a body.

Set `debug: true` while authoring a manifest to report exact invalid fields, malformed routes, duplicate IDs, invalid status codes or delays, route conflicts, unsafe paths, and missing referenced files. Request logging remains enabled independently by default.

## Passthrough to a development API

Lockxy can bypass all matching mocks and continue to the next Vite middleware, such as `server.proxy`:

```js
document.cookie = 'wesflo-mock-api-bypass=*; Path=/; SameSite=Lax';
```

Manifest endpoints can be bypassed individually by joining their IDs with `|`:

```js
document.cookie = 'wesflo-mock-api-bypass=orders|user-profile; Path=/; SameSite=Lax';
```

Remove the cookie to enable all mocks again:

```js
document.cookie = 'wesflo-mock-api-bypass=; Max-Age=0; Path=/; SameSite=Lax';
```

The optional [`@wesflo/lockxy-panel`](https://www.npmjs.com/package/@wesflo/lockxy-panel) provides browser controls for the same scenario and bypass behavior.

## Runtime behavior

At startup, Lockxy indexes every file path below `mockRoot` and loads the optional manifest once. The Vite watcher explicitly observes that directory even when it is outside `src`; adding or removing files rebuilds the index, while manifest changes reload its configuration. Candidate resolution uses the in-memory index instead of probing every possible filename on disk. Response contents are never cached, so new files and edited responses are available without restarting Vite. Request logs identify responses with a single source word such as `Manifest` or `Convention`; interactive terminal output also colors methods, statuses, delays, and sources.

The plugin is intended exclusively for local development and must not be used as a production server. Mock files must contain synthetic data only.

See the [full documentation](https://wesflo.github.io/lockxy/) for deeper explanations, examples, and local verification workflows.

## License

[MIT](./LICENSE)
