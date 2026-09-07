<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/wesflo/vite-plugin-local-mock-api/main/assets/brand/lockxy-lockup-on-dark.svg">
    <img src="https://raw.githubusercontent.com/wesflo/vite-plugin-local-mock-api/main/assets/brand/lockxy-lockup-on-light.svg" alt="Lockxy — Local Mock Proxy" width="360">
</picture>

# @wesflo/vite-plugin-local-mock-api

A plug-and-play Vite plugin for serving local API mocks through file naming conventions. A manifest is optional and adds scenarios, status codes, delays, and other per-route behavior when needed.

## Installation

```sh
pnpm add --save-dev @wesflo/vite-plugin-local-mock-api
```

## Minimal setup

```ts
import { defineConfig } from 'vite';
import { mockApiPlugin } from '@wesflo/vite-plugin-local-mock-api';

export default defineConfig(({ command }) => ({
    plugins: command === 'serve' ? [mockApiPlugin()] : [],
}));
```

Add a JSON file below `mock/` and request the matching URL from the Vite development server. For example, `mock/users/profile.json` handles `GET /users/profile`, while `mock/users/POST_profile.json` handles `POST /users/profile`.

The plugin is intended exclusively for local development and must not be used as a production server. Mock files must contain synthetic data only.

See the [full documentation](https://wesflo.github.io/vite-plugin-local-mock-api/) for naming precedence, manifests, delays, status responses, bypass cookies, and the optional proxy panel.

## License

[MIT](./LICENSE)
