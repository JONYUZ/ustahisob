function slugify(text) {
  const map = {
    'ў': 'u', 'ғ': 'gʻ', 'қ': 'q', 'ҳ': 'h', 'ё': 'yo', 'ц': 'c', 'ч': 'ch', 'ш': 'sh',
    'ъ': '', 'ы': 'i', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'ж': 'j', 'х': 'x',
  };
  let s = text.toLowerCase();
  s = s.replace(/[ўғқҳёцчшъыэюяжх]/g, ch => map[ch] || ch);
  s = s
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return s || 'kompaniya';
}

function uniqueSlug(db, baseText) {
  const base = slugify(baseText);
  let slug = base;
  let i = 1;
  const exists = (s) => db.prepare('SELECT id FROM companies WHERE slug = ?').get(s);
  while (exists(slug)) {
    i += 1;
    slug = `${base}-${i}`;
  }
  return slug;
}

module.exports = { slugify, uniqueSlug };
