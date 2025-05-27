import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

interface NavigationProps {
  movie?: string;
}

const Navigation: React.FC<NavigationProps> = ({ movie }) => (
  <div className="rmdb-navigation">
    <div className="rmdb-navigation-content">
      <Link to="/">
        <p>Home</p>
      </Link>
      <p>/</p>
      <p>{movie}</p>
    </div>
  </div>
);

export default Navigation;
