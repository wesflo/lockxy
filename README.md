<picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/brand/lockxy-lockup-on-dark.svg">
    <img src="./assets/brand/lockxy-lockup-on-light.svg" alt="Lockxy — Local Mock Proxy" width="420">
</picture>

# Lockxy

Plug-and-play local mock responses for API requests handled by the Vite development server.

## Why Lockxy

- ⚡ **Plug and play**<br> Add the Vite plugin, put response files in `mock/`, and keep using your application's real API calls. Naming conventions handle the routing; a manifest and the proxy panel are optional extensions.
- ✈️ **Work fully offline**<br> Develop on a plane, on a train, or anywhere else without a backend, VPN, internet connection, or expensive hotspot.
- 🔀 **Mocks live with the code**<br> Mock responses are versioned and reviewed in the repository, so frontend and backend developers can inspect shared API assumptions and quickly diagnose parallel or newly introduced endpoints.
- 🔒 **Mock data stays local**<br> Lockxy handles mock files on the developer's machine and does not upload requests or responses to an external mock service.
- 🪙 **No service costs**<br> There is no hosted mock API, usage plan, or metered traffic to pay for.
- 🛠️ **No hosting overhead**<br> Teams do not need to provision, secure, monitor, or maintain another server just to provide development mocks.

This project is intended exclusively for local development. Do not deploy the mock server or proxy panel as production services, and only use synthetic data in mock files.

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

## Quick start

```ts
import { defineConfig } from 'vite';
import lockxy from '@wesflo/vite-plugin-lockxy';

export default defineConfig(({ command }) => ({
    plugins: command === 'serve' ? [lockxy()] : [],
}));
```

With the default `/api/` request prefix, these files handle `GET` and `POST /api/users/profile`:

```text
mock/
└── users/
    ├── profile.json
    └── POST_profile.json
```

Method-specific files win over generic files. Nested route candidates win over root-level fallbacks, so `mock/users/PUT_profile.json`, `mock/users/profile.json`, `mock/PUT_profile.json`, and `mock/profile.json` are tried in that order for `PUT /api/users/profile`.

## Plugin configuration

All options are optional:

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
| `mockRoot` | `URL` | Project `mock/` directory | Contains mock files and the optional manifest. |
| `requestPrefixes` | `string \| readonly string[]` | `'/api/'` | One or more local URL namespaces handled by Lockxy. |
| `extensions` | `readonly string[]` | `[]` | Adds file extensions after the built-in JSON, PDF, CSV, text, JPEG, PNG, and WebP candidates. |
| `contentTypes` | `Readonly<Record<string, string>>` | `{}` | Adds or overrides extension-to-content-type mappings. |
| `manifestFileName` | `string` | `'mock.manifest.json'` | Manifest filename inside `mockRoot`. |
| `debug` | `boolean` | `false` | Enables detailed manifest and referenced-file validation. |
| `logging` | `boolean` | `true` | Logs requests and runtime errors. |

## Optional manifest

Naming conventions work without a manifest. Add `mock/mock.manifest.json` only for exceptional behavior such as statuses, delays, explicit files, dynamic paths, or selectable scenarios:

```json
{
    "$schema": "../node_modules/@wesflo/vite-plugin-lockxy/mock.manifest.schema.json",
    "id": "my-frontend",
    "delay": [200, 600],
    "endpoints": [
        {
            "path": "/api/health",
            "status": 204
        },
        {
            "method": ["POST", "PUT"],
            "path": "/api/users/:id",
            "file": "scenarios/user.json",
            "delay": 250
        }
    ]
}
```

Only `path` is required for an endpoint. `method` accepts either one method or an array such as `["POST", "PUT"]` when several methods share the same behavior. Without `method`, every method matches; without `file`, normal naming conventions resolve the response. Use `:id?` for an optional dynamic path segment. The optional root `id` enables project-specific selection storage in the panel. Root delay applies to all calls, while endpoint and scenario values override it. A single scenario is automatic; multiple scenarios can be selected with the optional panel. Set `debug: true` for precise validation diagnostics.

## Mock Proxy panel

Install the optional panel with the same package manager:

```sh
pnpm add --save-dev @wesflo/lockxy-panel
npm install --save-dev @wesflo/lockxy-panel
yarn add --dev @wesflo/lockxy-panel
```

In a Vite-powered micro frontend, register the Web Component and place it directly in the HTML:

```html
<wf-lockxy-panel></wf-lockxy-panel>

<script type="module">
    import '@wesflo/lockxy-panel';
</script>
```

For a direct browser integration without a module loader, use the self-contained UMD build:

```html
<wf-lockxy-panel></wf-lockxy-panel>
<script src="./node_modules/@wesflo/lockxy-panel/dist/wf-lockxy-panel.umd.cjs"></script>
```

The panel loads the manifest from the fixed `/_local-mock-api/manifest` route. A click on the floating button opens or closes the panel; `Escape` closes it as well. Hold Ctrl or Cmd while dragging the button to move it. Its position is saved in local storage and restored on the next visit.

## Multiple request prefixes and development APIs

Configure every local URL namespace Lockxy should handle through `requestPrefixes`:

```ts
import lockxy from '@wesflo/vite-plugin-lockxy';

lockxy({
    requestPrefixes: ['/api/', '/development-api/'],
});
```

A single prefix can be passed directly as `requestPrefixes: '/api/'`.

The application can use a local path such as `/development-api/users`, while Vite's `server.proxy` maps that prefix to any development API domain. Lockxy returns a matching local mock before the proxy runs. An endpoint or global bypass continues to the Vite proxy instead. Missing mock files remain visible as `404` responses and do not silently fall through.

## Temporarily bypassing mocks

The plugin can pass requests through unchanged to the next Vite middleware, for example a configured development API proxy. This does not require removing the plugin from the Vite configuration.

Set the `wesflo-mock-api-bypass` cookie to `*` to bypass all requests matching the configured `requestPrefixes`:

```js
document.cookie = 'wesflo-mock-api-bypass=*; Path=/; SameSite=Lax';
```

To bypass only selected endpoints, set the cookie to their manifest IDs separated by `|`:

```js
document.cookie = 'wesflo-mock-api-bypass=orders|user-details; Path=/; SameSite=Lax';
```

Selective bypasses use the endpoint `id` from `mock.manifest.json`, while matching the current request by HTTP method and path. When an ID is omitted, the manifest response generates one from method and path. All other endpoints continue to use their selected scenario or their local fallback file. The manifest route remains available even while global bypass is on.

Remove the bypass by expiring the cookie:

```js
document.cookie = 'wesflo-mock-api-bypass=; Max-Age=0; Path=/; SameSite=Lax';
```

The cookie name and global marker are exported as `BYPASS_COOKIE_NAME` and `BYPASS_ALL_VALUE`.

## Documentation

The Astro documentation application lives in `apps/docs`:

```sh
pnpm dev:docs
```

It is configured for `https://wesflo.github.io/lockxy/` and deployed manually from `main` through the production release workflow.

## Security

Please report vulnerabilities through [GitHub private vulnerability reporting](https://github.com/wesflo/lockxy/security/advisories/new), not through public issues. See the [security policy](./.github/SECURITY.md) for details.

Maintainer release setup is documented in the [release guide](./.github/RELEASING.md).

## License

[MIT](./LICENSE)
