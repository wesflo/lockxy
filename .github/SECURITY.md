# Security policy

## Supported versions

Security fixes are provided for the latest published versions of `@wesflo/vite-plugin-lockxy` and `@wesflo/lockxy-panel`.

## Reporting a vulnerability

Please do not report security vulnerabilities through public issues, pull requests, or discussions.

Use [GitHub private vulnerability reporting](https://github.com/wesflo/lockxy/security/advisories/new) and include:

- the affected package and version;
- steps to reproduce the issue;
- the expected and actual behavior;
- the potential impact; and
- a suggested mitigation, if available.

Reports will be reviewed privately. Details should only be published after a fix or mitigation is available.

## Security boundaries

This project is intended exclusively for local development. The Vite plugin, its mock server, and the proxy panel must not be deployed as production services or exposed to untrusted networks.

Mock files must contain synthetic data only. Panel cookies and the mock response header are development controls and must not be treated as authentication or other security boundaries.
