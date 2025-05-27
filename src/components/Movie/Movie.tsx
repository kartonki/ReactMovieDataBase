import React from 'react';
import { API_URL, API_KEY } from '../../config';
import Navigation from '../elements/Navigation/Navigation';
import MovieInfo from '../elements/MovieInfo/MovieInfo';
import MovieInfoBar from '../elements/MovieInfoBar/MovieInfoBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import Actor from '../elements/Actor/Actor';
import Spinner from '../elements/Spinner/Spinner';
import { Location } from 'react-router-dom';
import './Movie.css';

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

interface MovieProps {
  match: { params: { movieId: string } };
  location: Location;
}

class Movie extends React.Component<MovieProps, MovieState> {
  state: MovieState = {
    movie: null,
    actors: null,
    directors: [],
    loading: false
  };

  async componentDidMount() {
    const { movieId } = this.props.match.params;

    this.setState({ loading: true });

    const cached = localStorage.getItem(`${movieId}`);
    if (cached) {
      this.setState({ ...JSON.parse(cached), loading: false });
      return;
    }

    try {
      const movieEndpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
      const creditsEndpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;

      const [movieRes, creditsRes] = await Promise.all([
        fetch(movieEndpoint),
        fetch(creditsEndpoint)
      ]);
      const movie = await movieRes.json();
      const credits = await creditsRes.json();

      if (movie.status_code) {
        this.setState({ loading: false });
        return;
      }

      const directors = credits.crew.filter((member: CrewType) => member.job === "Director");
      const newState: MovieState = {
        movie,
        actors: credits.cast,
        directors,
        loading: false
      };
      this.setState(newState, () => {
        localStorage.setItem(`${movieId}`, JSON.stringify(newState));
      });
    } catch (error) {
      console.error('Error:', error);
      this.setState({ loading: false });
    }
  }

  render() {
    const { movie } = this.state;
    const movieName = (this.props.location.state && (this.props.location.state as any).movieName) || movie?.title;

    return (
      <div className="rmdb-movie">
        {movie ? (
          <div>
            <Navigation movie={movieName} />
            <MovieInfo movie={movie} directors={this.state.directors} />
            <MovieInfoBar time={movie.runtime} budget={movie.budget} revenue={movie.revenue} />
          </div>
        ) : null}
        {this.state.actors ? (
          <div className="rmdb-movie-grid">
            <FourColGrid header={'Actors'}>
              {this.state.actors.map((element, i) => (
                <Actor key={i} actor={element} />
              ))}
            </FourColGrid>
          </div>
        ) : null}
        {!this.state.actors && !this.state.loading ? <h1>No movie found</h1> : null}
        {this.state.loading ? <Spinner /> : null}
      </div>
    );
  }
}

export default Movie;