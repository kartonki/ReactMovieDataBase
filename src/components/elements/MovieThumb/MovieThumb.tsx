import React from 'react';
import { Link } from 'react-router-dom';
import './MovieThumb.css';
import ImageWebp from '../ImageWebP/ImageWebp';

interface MovieThumbProps {
  image: string;
  movieId: number;
  movieName: string;
  clickable: boolean;
}

const MovieThumb: React.FC<MovieThumbProps> = ({ image, movieId, movieName, clickable }) => (
  <div className="rmdb-moviethumb">
    {/* You can send props via the Links "to" object. Here we create our own "movieName" */}
    {clickable ?
      <Link to={{ pathname: `/${movieId}` }} state={{ movieName: movieName }}>
        <ImageWebp className="clickable" src={image} alt="moviethumb" />
      </Link>
      :
      <ImageWebp src={image} alt="moviethumb" />
    }
  </div>
)

export default MovieThumb;