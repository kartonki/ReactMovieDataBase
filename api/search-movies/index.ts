import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const apiKey = process.env.TMDB_API_KEY;
    const baseUrl = "https://api.themoviedb.org/3";
    
    if (!apiKey) {
        context.res = {
            status: 500,
            body: { error: "API key not configured" }
        };
        return;
    }

    try {
        const query = req.query.query;
        const page = req.query.page || "1";
        const language = req.query.language || "en-US";
        
        if (!query) {
            context.res = {
                status: 400,
                body: { error: "Query parameter is required" }
            };
            return;
        }
        
        const url = `${baseUrl}/search/movie?api_key=${apiKey}&language=${language}&query=${encodeURIComponent(query)}&page=${page}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: data
        };
    } catch (error) {
        context.log.error("Error searching movies:", error);
        context.res = {
            status: 500,
            body: { error: "Failed to search movies" }
        };
    }
};

export default httpTrigger;