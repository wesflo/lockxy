# vite-plugin-local-mock-api

Local mock responses for API requests handled by the Vite development server.

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

Selective bypasses use the endpoint `id` from `mock.manifest.json`, while matching the current request by HTTP method and path. All other endpoints continue to use their selected scenario or their local fallback file. The manifest route remains available even while global bypass is on.

Remove the bypass by expiring the cookie:

```js
document.cookie = 'wesflo-mock-api-bypass=; Max-Age=0; Path=/; SameSite=Lax';
```

The cookie name and global marker are exported as `BYPASS_COOKIE_NAME` and `BYPASS_ALL_VALUE`.
