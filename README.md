<picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/brand/lockxy-lockup-on-dark.svg">
    <img src="./assets/brand/lockxy-lockup-on-light.svg" alt="Lockxy — Local Mock Proxy" width="420">
</picture>

# Lockxy

Plug-and-play local mock responses for API requests handled by the Vite development server.

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

## Temporarily bypassing mocks

The plugin can pass requests through unchanged to the next Vite middleware, for example a configured development API proxy. This does not require removing the plugin from the Vite configuration.

Set the `wesflo-mock-api-bypass` cookie to `*` to bypass all requests below the configured `internalPrefix`:

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
