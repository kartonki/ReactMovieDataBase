import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from '../elements/Header/Header';
import Home from '../Home/Home';
import Movie from '../Movie/Movie';
import NotFound from '../elements/NotFound/NotFound';

const App: React.FC = () => (
  <BrowserRouter>
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:movieId" element={<Movie />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  </BrowserRouter>
);

export default App;