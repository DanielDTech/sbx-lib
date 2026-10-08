# sbx-lib

Validation and formatting shared by the sbx bookmarks API and web app.

- `validateBookmark({ title, url, tags, note })` returns `{ ok, errors }`. `note` is optional, at most 500 characters.
- `slugify(title)`, `formatDate(iso)`, `formatTags(tags)`.

Install from git, pinned to a release tag: `"sbx-lib": "github:DanielDTech/sbx-lib#v0.1.2"`.

Tests: `npm test`.
