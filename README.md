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

## Mock Proxy panel

In a Vite-powered micro frontend, register the Web Component and place it directly in the HTML:

```html
<wf-vite-mock-proxy></wf-vite-mock-proxy>

<script type="module">
    import '@wesflo/wf-vite-mock-proxy';
</script>
```

For a direct browser integration without a module loader, use the self-contained UMD build:

```html
<wf-vite-mock-proxy></wf-vite-mock-proxy>
<script src="./node_modules/@wesflo/wf-vite-mock-proxy/dist/wf-vite-mock-proxy.umd.cjs"></script>
```

The panel loads the manifest from the fixed `/_local-mock-api/manifest` route. A click on the floating button opens or closes the panel; `Escape` closes it as well. Hold Ctrl or Cmd while dragging the button to move it. Its position is saved in local storage and restored on the next visit.

## Multiple request prefixes and development APIs

Configure every local URL namespace Lockxy should handle through `requestPrefixes`:

```ts
mockApiPlugin({
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

It is configured for `https://wesflo.github.io/vite-plugin-local-mock-api/` and deployed manually from `main` through the production release workflow.

## Security

Please report vulnerabilities through [GitHub private vulnerability reporting](https://github.com/wesflo/vite-plugin-local-mock-api/security/advisories/new), not through public issues. See the [security policy](./.github/SECURITY.md) for details.

Maintainer release setup is documented in the [release guide](./.github/RELEASING.md).

## License

[MIT](./LICENSE)
