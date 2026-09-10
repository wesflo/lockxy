<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/wesflo/lockxy/main/assets/brand/lockxy-lockup-on-dark.svg">
    <img src="https://raw.githubusercontent.com/wesflo/lockxy/main/assets/brand/lockxy-lockup-on-light.svg" alt="Lockxy — Local Mock Proxy" width="360">
</picture>

# @wesflo/lockxy-panel

The optional Lockxy browser panel for configuring manifest scenarios provided by `@wesflo/vite-plugin-lockxy` during local development.

## Installation

With pnpm:

```sh
pnpm add --save-dev @wesflo/lockxy-panel
```

With npm:

```sh
npm install --save-dev @wesflo/lockxy-panel
```

With Yarn:

```sh
yarn add --dev @wesflo/lockxy-panel
```

Register the Web Component and add it to the HTML of a Vite application:

```html
<wf-lockxy-panel></wf-lockxy-panel>

<script type="module">
    import '@wesflo/lockxy-panel';
</script>
```

The panel requests the manifest from the plugin's fixed internal route and is only rendered when the manifest contains configurable endpoints. It is not required for convention-based mocks.

Valid bypass and scenario cookies survive page reloads and initialize the panel controls. Cookie entries that do not exist in the current manifest are cleaned after switching projects. Add a stable root `id` to `mock.manifest.json` to enable project-specific local-storage persistence:

```json
{
    "id": "checkout",
    "endpoints": []
}
```

Without a root `id`, the settings tab shows that project-specific storage is unavailable. Endpoints with zero or one scenario render a read-only description instead of a select because no choice is necessary. The endpoint footer can reset all Lockxy cookies and settings to their defaults and links directly to the documentation.

The panel is intended exclusively for local development and must not be included in production applications. Its cookies configure mock behavior and are not a security boundary.

See the [proxy panel documentation](https://wesflo.github.io/lockxy/proxy-panel/) for the complete integration and usage guide.

## License

[MIT](./LICENSE)
