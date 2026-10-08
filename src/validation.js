const TAG = /^[a-z0-9-]{1,30}$/;
const NOTE_MAX_LENGTH = 500;

export function validateBookmark(input) {
  const errors = [];
  const { title, url, tags = [], note } = input ?? {};
  if (typeof title !== 'string' || title.trim().length === 0) errors.push('title is required');
  else if (title.length > 200) errors.push('title is longer than 200 characters');
  if (typeof url !== 'string' || !/^https?:\/\/\S+$/i.test(url) || !URL.canParse(url)) errors.push('url must start with http:// or https://');
  if (!Array.isArray(tags)) errors.push('tags must be a list');
  else {
    if (tags.length > 10) errors.push('at most 10 tags');
    for (const tag of tags) if (typeof tag !== 'string' || !TAG.test(tag)) errors.push(`invalid tag: ${tag}`);
  }
  if (note !== undefined) {
    if (typeof note !== 'string') errors.push('note must be text');
    else if (note.length > NOTE_MAX_LENGTH) errors.push('note is longer than 500 characters');
  }
  return { ok: errors.length === 0, errors };
}
