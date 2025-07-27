// Movie service to abstract API calls away from components
// This service calls our Azure Function proxy instead of TMDB directly

interface MovieType {
    id: number;
    original_title: string;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    runtime: number;
    budget: number;
    revenue: number;
    [key: string]: any;
}

interface ActorType {
    cast_id: number;
    character: string;
    name: string;
    profile_path: string;
}

interface CrewType {
    job: string;
    name: string;
}

interface MovieCredits {
    cast: ActorType[];
    crew: CrewType[];
}

interface MovieResponse {
    page: number;
    results: MovieType[];
    total_pages: number;
    total_results: number;
}

class MovieService {
    private readonly baseUrl: string;

    constructor() {
        // Use environment variable for API URL, defaulting to production Azure Function
        this.baseUrl = process.env.REACT_APP_API_URL || 'https://reactmoviedb-api.azurewebsites.net/api';
    }

    async getPopularMovies(page: number = 1, language: string = 'en-US'): Promise<MovieResponse> {
        const response = await fetch(`${this.baseUrl}/movies/popular?page=${page}&language=${language}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch popular movies: ${response.status}`);
        }
        
        return response.json();
    }

    async searchMovies(query: string, page: number = 1, language: string = 'en-US'): Promise<MovieResponse> {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`${this.baseUrl}/movies/search?query=${encodedQuery}&page=${page}&language=${language}`);
        
        if (!response.ok) {
            throw new Error(`Failed to search movies: ${response.status}`);
        }
        
        return response.json();
    }

    async getMovieDetails(movieId: number, language: string = 'en-US'): Promise<MovieType> {
        const response = await fetch(`${this.baseUrl}/movies/${movieId}?language=${language}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch movie details: ${response.status}`);
        }
        
        return response.json();
    }

    async getMovieCredits(movieId: number): Promise<MovieCredits> {
        const response = await fetch(`${this.baseUrl}/movies/${movieId}/credits`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch movie credits: ${response.status}`);
        }
        
        return response.json();
    }
}

// Export a singleton instance
export const movieService = new MovieService();
export default movieService;
export type { MovieType, ActorType, CrewType, MovieCredits, MovieResponse };