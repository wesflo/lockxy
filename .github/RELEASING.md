# Releasing

The npm packages are released manually through GitHub Actions. Production and alpha releases are never triggered by a push or pull request.

## GitHub configuration

Create these GitHub environments without repository secrets:

- `npm-production`: restrict deployments to `main` and add the desired manual approval rule.
- `npm-alpha`: allow the feature branches used for alpha releases and add the desired manual approval rule.

The workflows use GitHub's automatically provided token only for committing the released version and pushing its package-specific Git tag. npm authentication uses OIDC and requires no stored token.

## Initial npm bootstrap

Both scoped packages must exist on npm before their Trusted Publisher settings can be configured:

- `@wesflo/vite-plugin-local-mock-api`
- `@wesflo/wf-vite-mock-proxy`

Publish each package once from a clean `main` checkout using an npm account with two-factor authentication. Build and test the package, choose and commit its initial version, inspect the package with `npm pack --dry-run`, publish it with `npm publish --access public`, and create the corresponding `plugin-v*` or `panel-v*` Git tag. Do not run an automated release until the committed version matches the version published during this bootstrap.

## npm Trusted Publishers

After the bootstrap, add the following GitHub Actions Trusted Publishers in the settings of each npm package:

| Package                              | Workflow                 | Environment      | Allowed action |
| ------------------------------------ | ------------------------ | ---------------- | -------------- |
| `@wesflo/vite-plugin-local-mock-api` | `release-production.yml` | `npm-production` | `npm publish`  |
| `@wesflo/vite-plugin-local-mock-api` | `release-alpha.yml`      | `npm-alpha`      | `npm publish`  |
| `@wesflo/wf-vite-mock-proxy`         | `release-production.yml` | `npm-production` | `npm publish`  |
| `@wesflo/wf-vite-mock-proxy`         | `release-alpha.yml`      | `npm-alpha`      | `npm publish`  |

The owner is `wesflo` and the repository is `vite-plugin-local-mock-api`. Workflow filenames and environment names are case-sensitive.

Once OIDC publishing has been verified, configure each npm package to require two-factor authentication and disallow traditional publish tokens.

## Manual releases

- Use **Production release** from `main` for stable npm releases and documentation deployment.
- Use **Alpha release** from a feature branch for prereleases published under the `alpha` distribution tag.

Select only the packages that should be released and choose the appropriate semantic version increment. Tests and builds must pass before publication.
