// Configuration for the React Movie Database app
// API calls are now proxied through Azure Functions instead of direct TMDB access
// Credit to TMDB API https://www.themoviedb.org/

const AI_KEY: string  = process.env.REACT_APP_AI_KEY || '';

// Images
// An image URL looks like this example:
// http://image.tmdb.org/t/p/w780/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

//Sizes: w300, w780, w1280, original
const BACKDROP_SIZE = 'w1280'

// w92, w154, w185, w342, w500, w780, original
const POSTER_SIZE = 'w500'

export {
  AI_KEY,
  IMAGE_BASE_URL,
  BACKDROP_SIZE,
  POSTER_SIZE
}