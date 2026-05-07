export function parsePage(pageRaw: unknown): string {
  if (pageRaw == null) {
    return '1';
  }
  const page = Number.parseInt(String(pageRaw), 10);
  if (!Number.isInteger(page) || page < 1 || page > 1000) {
    throw new Error('Invalid page parameter');
  }
  return String(page);
}

export function parseLanguage(languageRaw: unknown): string {
  if (languageRaw == null) {
    return 'en-US';
  }
  const language = String(languageRaw);
  if (!/^[a-z]{2}-[A-Z]{2}$/.test(language)) {
    throw new Error('Invalid language parameter');
  }
  return language;
}

export function parseMovieId(idRaw: unknown): string {
  const movieId = String(idRaw || '');
  if (!/^\d+$/.test(movieId)) {
    throw new Error('Movie ID must be numeric');
  }
  return movieId;
}

export function parseQuery(queryRaw: unknown): string {
  const query = String(queryRaw || '').trim();
  if (!query) {
    throw new Error('Query parameter is required');
  }
  if (query.length > 200) {
    throw new Error('Query parameter is too long');
  }
  return query;
}
