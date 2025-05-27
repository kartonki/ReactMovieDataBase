import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
    <div style={{
        textAlign: 'center',
        padding: '50px',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    }}>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for doesn't exist.</p>
        <Link to="/" style={{
            marginTop: '20px',
            color: '#007bff',
            textDecoration: 'none'
        }}>
            Return to Home
        </Link>
    </div>
);

export default NotFound;