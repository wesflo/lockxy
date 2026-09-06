# @wesflo/wf-vite-mock-proxy

An optional browser panel for configuring manifest scenarios provided by `@wesflo/vite-plugin-local-mock-api` during local development.

## Installation

```sh
pnpm add --save-dev @wesflo/wf-vite-mock-proxy
```

Register the Web Component and add it to the HTML of a Vite application:

```html
<wf-vite-mock-proxy></wf-vite-mock-proxy>

<script type="module">
    import '@wesflo/wf-vite-mock-proxy';
</script>
```

The panel requests the manifest from the plugin's fixed internal route and is only rendered when the manifest contains configurable endpoints. It is not required for convention-based mocks.

The panel is intended exclusively for local development and must not be included in production applications. Its cookies configure mock behavior and are not a security boundary.

See the [proxy panel documentation](https://wesflo.github.io/vite-plugin-local-mock-api/proxy-panel/) for the complete integration and usage guide.

## License

[MIT](./LICENSE)
