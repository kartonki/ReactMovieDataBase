import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import ImageWebp from '../ImageWebP/ImageWebp';

const Header = () => (
    <div className="rmdb-header">
        <div className="rmdb-header-content">
            <Link to="/">
                <ImageWebp className="rmdb-logo" src="/images/reactMovie_logo.png" alt="rmdb-logo" />                
            </Link>
            <a href="https://www.themoviedb.org/" target="_blank">
                <ImageWebp className="rmdb-tmdb-logo" src="/images/tmdb_logo.png" alt="tmdb-logo" />
            </a>
        </div>
    </div>
)

export default Header;