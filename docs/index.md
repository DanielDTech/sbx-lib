# sbx-lib

## What this repository is

`sbx-lib` is the shared validation and formatting library for the sbx bookmarks project. It is consumed by `sbx-api` and `sbx-web`.

Its one responsibility is to decide whether a bookmark is valid and to turn bookmark fields into display strings, so that both consumers agree on those answers instead of each writing their own copy.

It is not published to any registry. Consumers install it from git, pinned to a release tag. Both currently pin:

```
"sbx-lib": "github:DanielDTech/sbx-lib#v0.1.1"
```

## Areas

The code separates into two modules.

| Module | Lives in | Owns |
| --- | --- | --- |
| validation | `src/validation.js` | Whether a bookmark is acceptable, and the error messages explaining why not |
| formatting | `src/format.js` | Turning bookmark fields into display strings |

`index.js` re-exports both modules. That re-export is the public contract: `sbx-api` and `sbx-web` import from the package root, not from `src/`.

The two modules are one area of ownership, not two. They are small, they change together, and they share a single public contract through `index.js`. Treat a change to either as a change to the whole library.

### validation

`src/validation.js` exports `validateBookmark(input)`, which returns `{ ok, errors }`. `ok` is true only when `errors` is empty. It never throws for bad input; a missing or malformed body comes back as `ok: false`.

| Field | Rule |
| --- | --- |
| `title` | Required, non-blank, at most 200 characters |
| `url` | Must match `http(s)://…` and be parseable by `URL.canParse` |
| `tags` | A list, at most 10 entries, each matching `/^[a-z0-9-]{1,30}$/` |

### formatting

`src/format.js` exports three pure functions.

| Function | Returns |
| --- | --- |
| `slugify(title)` | A lowercase hyphenated slug, with accents folded |
| `formatDate(iso)` | The first 10 characters of the ISO date, i.e. `YYYY-MM-DD` |
| `formatTags(tags)` | Each tag prefixed with `#`, space-separated |

## Build, run and test

There is no build step. The source is plain ES modules (`"type": "module"`), shipped and imported as written.

| Task | Command |
| --- | --- |
| Install | `npm install` |
| Test | `npm test` (runs `node --test`) |

Node >= 22 is required, as declared in `engines`. Verified working on v24.21.0.

CI (`.github/workflows/ci.yml`) runs `npm install` then `npm test` on Node 22, on every push to `main` and on every pull request.

## Delivery platforms

None of its own.

`sbx-lib` is a library with no runtime surface: no HTTP server, no CLI, no UI, nothing to deploy or start. It reaches production only as a dependency inside `sbx-api` and `sbx-web`, which have their own delivery platforms.

Two consequences, both of which matter when deciding where a test belongs:

- Nobody should test this library's behaviour from a consumer repository. Validation and formatting rules are tested here, in `test/`, against `index.js`.
- Nobody should test a consumer's behaviour here. This repository has no knowledge of HTTP routes, pages, storage, or anything else a consumer does with the results.

## Dependencies

There are none: zero runtime dependencies and zero dev dependencies. `package.json` declares no `dependencies` and no `devDependencies`.

Because of that, this repository owns all of its own behaviour. Any failing test here points at code in `src/`.

| Thing it uses | Who owns it | Note |
| --- | --- | --- |
| Node built-in test runner (`node --test`) | Node | The only tooling. There is no test framework, no bundler, no linter, no transpiler |
| `URL` global, via `URL.canParse` | Node | Used by `validateBookmark` to reject URLs that look well-formed but do not parse. Node's URL parsing is not this repository's behaviour and must not be tested here |

## Local environment

Nothing needs to be running, and nothing needs the network. There is no server, no database, and no service to start. Install once, then iterate with the test runner.

```sh
npm install
npm test
```

For a fast loop while editing, keep the watcher running; it re-runs the tests on every save and needs nothing else:

```sh
node --test --watch
```

### Iterating from a consumer against an unreleased local change

When a change here is not released yet and you need `sbx-api` or `sbx-web` to see it, link the working copy. In `sbx-lib`:

```sh
npm link
```

Then in the consumer repository:

```sh
npm link sbx-lib
```

The consumer's `node_modules/sbx-lib` is now a symlink to this working copy, so edits here are visible immediately with no reinstall and no release.

This is temporary and local only. Undo it before any commit, because the committed dependency must stay a pinned release tag. In the consumer:

```sh
npm unlink sbx-lib
npm install
```

And in `sbx-lib`, to drop the global link:

```sh
npm uninstall -g sbx-lib
```

Two things to know about these commands:

- Run `npm unlink sbx-lib` only in the consumer. Run in `sbx-lib` itself it does not remove the global link, and it rewrites `package.json` formatting. Use `npm uninstall -g sbx-lib` here instead.
- `npm link` writes to npm's global prefix. If it fails with `EACCES` on a root-owned prefix such as `/usr/lib/node_modules`, point npm at a writable one once, and do not use `sudo`:

  ```sh
  npm config set prefix "$HOME/.npm-global"
  ```

Confirm you are unlinked before committing: `git status` in the consumer must show no change to its `package.json`, and that `package.json` must still pin `github:DanielDTech/sbx-lib#vX.Y.Z`.

## Releasing

See [release.md](release.md). In short: this repository releases by git tag only and publishes to no registry.
