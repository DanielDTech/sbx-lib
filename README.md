# sbx-lib

Validation and formatting shared by the sbx bookmarks API and web app.

- `validateBookmark({ title, url, tags })` returns `{ ok, errors }`.
- `slugify(title)`, `formatDate(iso)`, `formatTags(tags)`.

Install from git, pinned to a release tag: `"sbx-lib": "github:DanielDTech/sbx-lib#v0.1.0"`.

Tests: `npm test`.
