# Releasing sbx-lib

A release is a git tag `vX.Y.Z` on `main`, matching `version` in `package.json`. This repository releases by git tag only and publishes to no registry. Consumers move to a release by changing the pinned tag in their own `package.json`.

Existing tags: `v0.1.0`, `v0.1.1`.

## Steps

1. Bump `version` in `package.json` in the same pull request as the change itself. A release is never a separate version-only pull request, and a behaviour change is never merged without its bump.
2. Get the pull request reviewed, green in CI, and merged to `main`.
3. Check out `main` and pull, so the tag lands on the merged commit:

   ```sh
   git checkout main && git pull
   ```

4. Confirm the version you are about to tag is the one on `main`:

   ```sh
   node -p "require('./package.json').version"
   ```

   The tag must be that version with a `v` prefix. If they disagree, stop and fix `package.json` first.
5. Tag the merge commit on `main`:

   ```sh
   git tag v0.1.2
   ```

6. Push the tag:

   ```sh
   git push origin v0.1.2
   ```

7. Tell each consumer to repoint its pinned tag. There is no automatic update: a consumer stays on its old tag until someone changes it.

| Consumer | Change |
| --- | --- |
| `sbx-api` | `"sbx-lib": "github:DanielDTech/sbx-lib#v0.1.2"` in `package.json`, then `npm install`, committed as its own pull request |
| `sbx-web` | The same |

## Notes

- Never move or delete a published tag. Consumers resolve the tag at install time, so a moved tag silently changes what they have already installed. If a release is wrong, bump again and release a new tag.
- `npm publish` is not part of this process. Nothing here is published to npm or any other registry.
