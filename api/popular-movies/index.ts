import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { handleOptions, rejectDisallowedOrigin, jsonResponse } from '../shared/http';
import { parseLanguage, parsePage } from '../shared/validation';

export async function popularMovies(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        const page = parsePage(req.query.get('page'));
        const language = parseLanguage(req.query.get('language'));

        const url = `${baseUrl}/movie/popular?api_key=${apiKey}&language=${language}&page=${page}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }

        const data = await response.json();
        return jsonResponse(req, 200, data);
    } catch (error) {
        context.error("Error fetching popular movies:", error);
        const message = error instanceof Error ? error.message : '';
        const status = message.startsWith('Invalid ') ? 400 : 500;
        return jsonResponse(req, status, {
            error: status === 400 ? message : "Failed to fetch popular movies"
        });
    }
}

app.http('popularMovies', {
    methods: ['GET', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'movies/popular',
    handler: popularMovies,
});