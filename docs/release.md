# Releasing sbx-lib

A release is a git tag `vX.Y.Z` on `main`, matching `version` in `package.json`. This repository releases by git tag only and publishes to no registry. Consumers move to a release by changing the pinned tag in their own `package.json`.

Existing tags: `v0.1.0`, `v0.1.1`.

## Definition of done

A release is not complete when the tag is pushed. A release is complete only when all of the following are true:

- The tag `vX.Y.Z` exists on `main` and is pushed to `origin`.
- `sbx-api` pins that tag in its `sbx-lib` dependency in `package.json`, and that change is merged with green CI.
- `sbx-web` pins that tag in its `sbx-lib` dependency in `package.json`, and that change is merged with green CI.

Both consumer repoints are part of the release, not a notification sent after it. Track them as part of the same unit of work as the library change itself: the change is not finished, and the release is not finished, until `sbx-api` and `sbx-web` are both on the new tag and both green on it.

Do not start another change to this library while a release is incomplete. Both consumers must be back on the same tag before the next shared-dependency change is attempted.

**If only one consumer is repointed, nothing errors.** There is no registry and no dependency bot, so nothing updates automatically and nothing fails. `sbx-api` and `sbx-web` simply run different validation and formatting rules, the two surfaces disagree about whether the same bookmark is valid and how it is displayed, and the divergence is silent until someone notices the two behaving differently.

Both consumers currently pin `github:DanielDTech/sbx-lib#v0.1.1`.

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

7. Repoint **both** consumers to the new tag. This is part of this release, not a request handed to someone else. There is no automatic update: a consumer stays on its old tag until someone changes it. Each consumer changes its `sbx-lib` entry under `dependencies` in its own `package.json`:

   | Consumer | Field to change in its `package.json` | New value |
   | --- | --- | --- |
   | `sbx-api` | `dependencies` → `sbx-lib` | `"sbx-lib": "github:DanielDTech/sbx-lib#v0.1.2"` |
   | `sbx-web` | `dependencies` → `sbx-lib` | `"sbx-lib": "github:DanielDTech/sbx-lib#v0.1.2"` |

   In each consumer, make the edit, run `npm install`, and commit it as that repository's own pull request.

8. Confirm the release is complete before calling it done: both pull requests from step 7 are merged, and CI is green in `sbx-api` and in `sbx-web` on the new pin. If either consumer is still on the old tag, the release is unfinished, regardless of the tag existing.

## Notes

- Never move or delete a published tag. Consumers resolve the tag at install time, so a moved tag silently changes what they have already installed. If a release is wrong, bump again and release a new tag.
- `npm publish` is not part of this process. Nothing here is published to npm or any other registry.
