# Local Mock API roadmap

This roadmap groups possible improvements by scope and expected effort. It is a direction for future discussions, not a release commitment.

The core principle remains unchanged: local mock files and naming conventions should be enough for the common case. The manifest and proxy panel add control when a project needs it, without becoming mandatory.

## 1.x — Strengthen the foundation

These improvements build on the current workflow without changing its mental model.

### Manifest validation and editor support

- Publish a JSON Schema for autocomplete and inline validation.
- Report the exact invalid field and its location.
- Detect missing files, duplicate IDs, invalid status codes, and conflicting routes.
- Keep a missing manifest valid so convention-only projects remain plug and play.

### Transparent request matching

- Add an optional diagnostic mode that lists every candidate path considered by the naming convention.
- Show which file, manifest entry, or scenario supplied the response.
- Explain why a request was passed through or returned as not found.

### HTTP correctness

- Ensure `204`, `304`, and `HEAD` responses never include an invalid body.
- Verify content length, binary files, multiple headers, cookies, and CORS preflight behavior.
- Add focused regression tests for protocol-specific behavior.

### Panel quality of life

- Show the most recent request and whether it was mocked or passed through.
- Surface manifest validation errors directly in the panel.
- Make the active environment and global bypass state more prominent.

## 2.x — Better workflows across applications

These features add convenience for larger frontends and multiple micro frontends while preserving the simple default setup.

### Shared state for micro frontends

- Define a versioned and namespaced state model for project, environment, endpoint, and scenario selections.
- Use local storage as the persistent source and cookies only for data required by the proxy request.
- Synchronize changes across tabs and micro frontends.
- Provide safe fallbacks for removed endpoints and scenarios.

### Request history

- Display a compact history with method, URL, status, duration, source, and bypass state.
- Allow filtering by mocked, passed-through, successful, and failed requests.
- Keep retention bounded and development-only.

### Network behavior profiles

- Support deterministic presets such as `slow`, `offline`, and `unstable`.
- Optionally support delay ranges, timeouts, connection failures, and error rates.
- Make deterministic values the default so automated tests remain reproducible.

### Typed manifest authoring

- Export the public manifest types.
- Optionally support a TypeScript manifest with `satisfies MockManifest`.
- Keep JSON as the documented default and lowest-effort path.

### Portable panel configuration

- Export and import project selections as a small JSON file.
- Reset one endpoint, one project, or all stored state independently.
- Make configuration migrations explicit when the stored schema changes.

## 3.0 — Contract and capture tooling

These are substantial capabilities that should only be considered if the tool needs to grow beyond local file-based mocking.

### OpenAPI integration

- Validate manifest endpoints and responses against an OpenAPI contract.
- Use contract examples as an optional fallback.
- Report missing, outdated, and incompatible mocks.
- Avoid making OpenAPI a prerequisite for using the plugin.

### Record a real response as a mock

- Pass a request through to a development API and save its response as a local mock.
- Preview and edit the destination before writing a file.
- Redact authorization headers, cookies, personal data, and configured sensitive fields.
- Make recording an explicit development action, never an automatic background feature.

### Advanced scenario orchestration

- Model sequences such as loading, success, retry, and failure across multiple calls.
- Support stateful scenarios only behind an explicit opt-in.
- Keep independent, stateless endpoint scenarios as the normal behavior.

## Evaluation criteria

Before adding a feature, verify that it:

1. Keeps convention-only usage simple.
2. Does not make the manifest or panel mandatory.
3. Produces deterministic behavior by default.
4. Remains development-only and difficult to enable accidentally in production.
5. Provides enough debugging information for a human to understand why a response was selected.
6. Justifies its maintenance cost for both the plugin and consuming applications.
