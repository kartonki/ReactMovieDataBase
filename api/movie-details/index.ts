import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { handleOptions, rejectDisallowedOrigin, jsonResponse } from '../shared/http';
import { parseLanguage, parseMovieId } from '../shared/validation';

export async function movieDetails(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        const movieId = parseMovieId(req.params.id);
        const language = parseLanguage(req.query.get('language'));

        const url = `${baseUrl}/movie/${movieId}?api_key=${apiKey}&language=${language}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }

        const data = await response.json();
        return jsonResponse(req, 200, data);
    } catch (error) {
        context.error("Error fetching movie details:", error);
        const message = error instanceof Error ? error.message : '';
        const status = message.startsWith('Invalid ') || message.includes('Movie ID') ? 400 : 500;
        return jsonResponse(req, status, {
            error: status === 400 ? message : "Failed to fetch movie details"
        });
    }
}

app.http('movieDetails', {
    methods: ['GET', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'movies/{id}',
    handler: movieDetails,
});