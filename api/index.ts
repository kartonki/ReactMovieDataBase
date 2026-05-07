// Entry point for Azure Functions v4 code-based registration.
// Importing each module causes the app.http() calls to execute and register the routes.
import './popular-movies/index';
import './search-movies/index';
import './movie-details/index';
import './movie-credits/index';
