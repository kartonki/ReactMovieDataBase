import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { handleOptions, rejectDisallowedOrigin, jsonResponse } from '../shared/http';
import { parseLanguage, parsePage, parseQuery } from '../shared/validation';

export async function searchMovies(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const preflight = handleOptions(req);
    if (preflight) return preflight;

    const rejected = rejectDisallowedOrigin(req);
    if (rejected) return rejected;

    const apiKey = process.env.TMDB_API_KEY;
    const baseUrl = "https://api.themoviedb.org/3";

    if (!apiKey) {
        return jsonResponse(req, 500, { error: "API key not configured" });
    }

    try {
        const query = parseQuery(req.query.get('query'));
        const page = parsePage(req.query.get('page'));
        const language = parseLanguage(req.query.get('language'));

        const url = `${baseUrl}/search/movie?api_key=${apiKey}&language=${language}&query=${encodeURIComponent(query)}&page=${page}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }

        const data = await response.json();
        return jsonResponse(req, 200, data);
    } catch (error) {
        context.error("Error searching movies:", error);
        const message = error instanceof Error ? error.message : '';
        const status = message.startsWith('Invalid ') || message.includes('required') ? 400 : 500;
        return jsonResponse(req, status, {
            error: status === 400 ? message : "Failed to search movies"
        });
    }
}

app.http('searchMovies', {
    methods: ['GET', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'movies/search',
    handler: searchMovies,
});