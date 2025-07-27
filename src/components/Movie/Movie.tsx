import React from 'react';
import movieService, { MovieType, ActorType, CrewType } from '../../services/movieService';
import Navigation from '../elements/Navigation/Navigation';
import MovieInfo from '../elements/MovieInfo/MovieInfo';
import MovieInfoBar from '../elements/MovieInfoBar/MovieInfoBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import Actor from '../elements/Actor/Actor';
import Spinner from '../elements/Spinner/Spinner';
import { Location } from 'react-router-dom';
import './Movie.css';

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
      const [movie, credits] = await Promise.all([
        movieService.getMovieDetails(parseInt(movieId)),
        movieService.getMovieCredits(parseInt(movieId))
      ]);

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