import React, { Component } from 'react';
import { API_URL, API_KEY } from '../../config';
import Navigation from '../elements/Navigation/Navigation';
import MovieInfo from '../elements/MovieInfo/MovieInfo';
import MovieInfoBar from '../elements/MovieInfoBar/MovieInfoBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import Actor from '../elements/Actor/Actor';
import Spinner from '../elements/Spinner/Spinner';
import './Movie.css';
import { useParams, useLocation } from 'react-router-dom';

interface MatchParams {
  [key: string]: string | undefined;
  movieId: string;
}
interface MovieProps {
  movieName?: string;
  match: { params: MatchParams };
  location: ReturnType<typeof useLocation> & { movieName?: string };
}
interface MovieType {
  runtime: number;
  budget: number;
  revenue: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
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

interface MovieState {
  movie: MovieType | null;
  actors: ActorType[] | null;
  directors: CrewType[];
  loading: boolean;
}

class Movie extends Component<MovieProps, MovieState> {
  state: MovieState = {
    movie: null,
    actors: null,
    directors: [],
    loading: false
  }

async componentDidMount() {
    const { movieId } = this.props.match.params;
    this.setState({ loading: true });

    try {
        // Try to get cached data first
        const cachedData = this.getCachedMovieData(movieId);
        if (cachedData) {
            this.setState({ ...cachedData, loading: false });
            return;
        }

        // If no cached data, fetch from API
        const endpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
        await this.fetchItems(endpoint);
    } catch (error) {
        console.error('Failed to load movie:', error);
        this.setState({ loading: false });
    }
}

private getCachedMovieData(movieId: string): MovieState | null {
    try {
        const storedData = localStorage.getItem(`${movieId}`);
        if (!storedData) return null;

        const parsedData = JSON.parse(storedData) as MovieState;
        // Validate cached data has required properties
        if (parsedData.movie && parsedData.actors) {
            return parsedData;
        }
        return null;
    } catch {
        // If parsing fails, remove corrupt data
        localStorage.removeItem(`${movieId}`);
        return null;
    }
}

  fetchItems = async (endpoint: string) => {
    const { movieId } = this.props.match.params;
    try {
      const response = await fetch(endpoint);
      const result = await response.json();

      if (result.status_code) {
        this.setState({ loading: false });
        return;
      }

      this.setState({ movie: result });

      // Fetch actors and directors
      const creditsEndpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
      const creditsResponse = await fetch(creditsEndpoint);
      const creditsResult = await creditsResponse.json();

      const directors = creditsResult.crew.filter((member: CrewType) => member.job === "Director");

      this.setState({
        actors: creditsResult.cast,
        directors,
        loading: false
      }, () => {
        localStorage.setItem(`${movieId}`, JSON.stringify(this.state));
      });
    } catch (error) {
      console.error('Error:', error);
      this.setState({ loading: false });
    }
  }

  render() {
    // ES6 Destructuring the props and state
    const { movieName } = this.props.location;
    const { movie, directors, actors, loading } = this.state;

    return (
      <div className="rmdb-movie">
        {movie ?
        <div>
          <Navigation movie={movieName} />
          <MovieInfo movie={movie} directors={directors} />
          <MovieInfoBar time={(movie as MovieType).runtime} budget={(movie as MovieType).budget} revenue={(movie as MovieType).revenue} />
        </div>
        : null }
        {actors ?
        <div className="rmdb-movie-grid">
          <FourColGrid header={'Actors'}>
            {actors && actors.map( (element, i) => (
              <Actor key={i} actor={element} />
            ))}
          </FourColGrid>
        </div>
        : null }
        {!actors && !loading ? <h1>No movie found</h1> : null }
        {loading ? <Spinner /> : null}
      </div>
    )
  }
}

// Wrapper for v6 routing
function MovieWithRouter(props: Partial<Omit<MovieProps, 'match' | 'location'>>) {
  const params = useParams<MatchParams>();
  const location = useLocation();
  if (!params.movieId) {
    return <div>No movie ID provided.</div>;
  }
  return <Movie {...props} match={{ params: { ...params, movieId: params.movieId } }} location={location} />;
}

export default MovieWithRouter;