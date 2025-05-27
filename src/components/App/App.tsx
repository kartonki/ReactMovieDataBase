import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, useLocation } from 'react-router-dom';
import Header from '../elements/Header/Header';
import Home from '../Home/Home';
import Movie from '../Movie/Movie';
import NotFound from '../elements/NotFound/NotFound';

function MovieWrapper() {
    const params = useParams<{ movieId?: string }>();
    const location = useLocation();
    if (!params.movieId) {
        return <div>No movie ID provided.</div>;
    }
    return <Movie match={{ params: { movieId: params.movieId } }} location={location} />;
}

const App: React.FC = () => {
    return (
        <Router>
            <div className="app">
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/movie/:movieId" element={<MovieWrapper />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;