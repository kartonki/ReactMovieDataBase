import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import ImageWebp from '../ImageWebP/ImageWebp';

const TMDB_URL = 'https://www.themoviedb.org/';

const Header: React.FC = () => {
    return (
        <header className="rmdb-header">
            <div className="rmdb-header-content">
                <Link to="/">
                    <ImageWebp 
                        className="rmdb-logo" 
                        src="/images/reactMovie_logo.png" 
                        alt="Movie Database Logo" 
                    />                
                </Link>
                <a href={TMDB_URL} target="_blank" rel="noopener noreferrer">
                    <ImageWebp 
                        className="rmdb-tmdb-logo" 
                        src="/images/tmdb_logo.png" 
                        alt="TMDB Logo" 
                    />
                </a>
            </div>
        </header>
    );
};

export default Header;