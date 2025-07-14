import React from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL } from '../../../config';
import { generatePosterSrcSet } from '../../../helpers';
import './MovieThumb.css';
import ImageWebp from '../ImageWebP/ImageWebp';

interface MovieThumbProps {
  image: string;
  movieId: number;
  movieName: string;
  clickable: boolean;
}

// Helper function to extract TMDB image path from full URL
const extractImagePath = (fullUrl: string, baseUrl: string): string | null => {
  if (!fullUrl.startsWith(baseUrl)) return null;
  
  // Remove base URL and size prefix (e.g., "w500")
  const remaining = fullUrl.replace(baseUrl, '');
  const sizeMatch = remaining.match(/^w\d+(.+)$/);
  return sizeMatch ? sizeMatch[1] : null;
};

const MovieThumb: React.FC<MovieThumbProps> = ({ image, movieId, movieName, clickable }) => {
  // Generate srcset if it's a TMDB image
  const imagePath = extractImagePath(image, IMAGE_BASE_URL);
  const imageSrcSet = imagePath ? generatePosterSrcSet(IMAGE_BASE_URL, imagePath) : undefined;
  
  return (
    <div className="rmdb-moviethumb">
      {/* You can send props via the Links "to" object. Here we create our own "movieName" */}
      {clickable ?
        <Link to={`/movie/${movieId}`}>
          <ImageWebp 
            className="clickable" 
            src={image} 
            srcSet={imageSrcSet}
            sizes="(max-width: 480px) 154px, (max-width: 768px) 185px, (max-width: 1200px) 342px, 500px"
            alt="moviethumb" 
          />
        </Link>
        :
        <ImageWebp 
          src={image} 
          srcSet={imageSrcSet}
          sizes="(max-width: 480px) 154px, (max-width: 768px) 185px, (max-width: 1200px) 342px, 500px"
          alt="moviethumb" 
        />
      }
    </div>
  );
};

export default MovieThumb;