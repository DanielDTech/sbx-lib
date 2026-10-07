export function slugify(title) {
  return title.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function formatDate(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

export function formatTags(tags) {
  return tags.map((tag) => `#${tag}`).join(' ');
}
