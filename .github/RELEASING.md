# Releasing

The npm packages are released manually through GitHub Actions. Production and alpha releases are never triggered by a push or pull request.

## GitHub configuration

Create these GitHub environments:

- `npm-production`: restrict deployments to `main`, add the desired manual approval rule, and provide the `RELEASE_DEPLOY_KEY` environment secret.
- `npm-alpha`: allow the feature branches used for alpha releases, add the desired manual approval rule, and do not add publishing secrets.

npm authentication uses OIDC and requires no stored npm token. Alpha releases use GitHub's automatically provided token to push their version commit and package-specific Git tag. Production releases load a repository-scoped SSH deploy key only for the final push so the version commit and tag can bypass the protected `main` ruleset.

## Production deploy key

Create a dedicated SSH key without a passphrase:

```sh
ssh-keygen -t ed25519 -C "lockxy-release" -f ./lockxy-release-deploy-key -N ""
```

Add its public key to the repository under **Settings → Deploy keys**, enable write access, and add that deploy key to the `main` ruleset bypass list. Store only its private key as the `RELEASE_DEPLOY_KEY` secret in the `npm-production` environment. A passphrase-protected key cannot be unlocked interactively by the GitHub Actions runner.

The production release stops before testing or publishing when this secret is missing. The private key becomes available only after the `npm-production` environment has been approved and is loaded into a temporary SSH agent only for the final push. Do not reuse a personal SSH key and do not add this key as a repository-level secret.

## Initial npm bootstrap

Both scoped packages must exist on npm before their Trusted Publisher settings can be configured:

- `@wesflo/vite-plugin-lockxy`
- `@wesflo/lockxy-panel`

Publish each package once from a clean `main` checkout using an npm account with two-factor authentication. Build and test the package, choose and commit its initial version, inspect the package with `npm pack --dry-run`, publish it with `npm publish --access public`, and create the corresponding `vite-plugin-lockxy-v*` or `lockxy-panel-v*` Git tag. Do not run an automated release until the committed version matches the version published during this bootstrap.

## npm Trusted Publishers

After the bootstrap, add the following GitHub Actions Trusted Publishers in the settings of each npm package:

| Package                      | Workflow                 | Environment      | Allowed action |
| ---------------------------- | ------------------------ | ---------------- | -------------- |
| `@wesflo/vite-plugin-lockxy` | `release-production.yml` | `npm-production` | `npm publish`  |
| `@wesflo/vite-plugin-lockxy` | `release-alpha.yml`      | `npm-alpha`      | `npm publish`  |
| `@wesflo/lockxy-panel`       | `release-production.yml` | `npm-production` | `npm publish`  |
| `@wesflo/lockxy-panel`       | `release-alpha.yml`      | `npm-alpha`      | `npm publish`  |

The owner is `wesflo` and the repository is `lockxy`. Workflow filenames and environment names are case-sensitive.

Once OIDC publishing has been verified, configure each npm package to require two-factor authentication and disallow traditional publish tokens.

## Manual releases

- Use **Production release** from `main` for stable npm releases and documentation deployment.
- Use **Alpha release** from a feature branch for prereleases published under the `alpha` distribution tag.

Select only the packages that should be released and choose the appropriate semantic version increment. Tests and builds must pass before publication.
