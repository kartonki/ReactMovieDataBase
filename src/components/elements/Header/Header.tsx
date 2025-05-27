import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import ImageWebp from '../ImageWebP/ImageWebp';

// Move constants to a separate config file or environment variables
const LOGOS = {
    REACT_MOVIE: {
        src: '/images/reactMovie_logo.png',
        alt: 'Movie Database Logo',
        className: 'rmdb-logo'
    },
    TMDB: {
        src: '/images/tmdb_logo.png',
        alt: 'TMDB Logo',
        className: 'rmdb-tmdb-logo',
        url: 'https://www.themoviedb.org/'
    }
} as const;

const Header: React.FC = () => (
    <header className="rmdb-header">
        <div className="rmdb-header-content">
            <Link to="/">
                <ImageWebp {...LOGOS.REACT_MOVIE} />
            </Link>
            <a href={LOGOS.TMDB.url} target="_blank" rel="noopener noreferrer">
                <ImageWebp {...LOGOS.TMDB} />
            </a>
        </div>
    </header>
);

export default Header;