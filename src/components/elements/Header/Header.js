import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => (
    <div className="rmdb-header">
        <div className="rmdb-header-content">
            <Link to="/">
                <img className="rmdb-logo" src="/images/reactMovie_logo.png" alt="rmdb-logo" />                
            </Link>
            <a href="https://www.themoviedb.org/" target="_blank">
                <img className="rmdb-tmdb-logo" src="/images/tmdb_logo.png" alt="tmdb-logo" />
            </a>
        </div>
    </div>
)

export default Header;