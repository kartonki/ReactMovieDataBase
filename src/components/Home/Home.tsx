import React, { useState, useEffect } from 'react';
import { IMAGE_BASE_URL, POSTER_SIZE, BACKDROP_SIZE } from '../../config';
import movieService, { MovieType } from '../../services/movieService';
import HeroImage from '../elements/HeroImage/HeroImage';
import SearchBar from '../elements/SearchBar/SearchBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import MovieThumb from '../elements/MovieThumb/MovieThumb';
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn';
import Spinner from '../elements/Spinner/Spinner';
import './Home.css';

interface HomeState {
    movies: MovieType[];
    heroImage: MovieType | null;
    loading: boolean;
    currentPage: number;
    totalPages: number;
    searchTerm: string;
}

const Home: React.FC = () => {
    const [state, setState] = useState<HomeState>({
        movies: [],
        heroImage: null,
        loading: false,
        currentPage: 0,
        totalPages: 0,
        searchTerm: ''
    });

    useEffect(() => {
        const storedState = sessionStorage.getItem('HomeState');
        if (storedState) {
            setState(JSON.parse(storedState));
        } else {
            fetchPopularMovies();
        }
    }, []);

    const fetchPopularMovies = async () => {
        setState(prev => ({ ...prev, loading: true }));
        
        try {
            const result = await movieService.getPopularMovies();
            setState(prev => {
                const newState = {
                    movies: result.results,
                    heroImage: result.results[0],
                    loading: false,
                    currentPage: result.page,
                    totalPages: result.total_pages,
                    searchTerm: ''
                };
                
                sessionStorage.setItem('HomeState', JSON.stringify(newState));
                return newState;
            });
        } catch (error) {
            console.error('Error:', error);
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    const fetchMoreMovies = async (page: number, searchTerm: string = '') => {
        setState(prev => ({ ...prev, loading: true }));
        
        try {
            const result = searchTerm 
                ? await movieService.searchMovies(searchTerm, page)
                : await movieService.getPopularMovies(page);
                
            setState(prev => {
                const newState = {
                    movies: [...prev.movies, ...result.results],
                    heroImage: prev.heroImage || result.results[0],
                    loading: false,
                    currentPage: result.page,
                    totalPages: result.total_pages,
                    searchTerm: prev.searchTerm
                };
                
                if (!prev.searchTerm) {
                    sessionStorage.setItem('HomeState', JSON.stringify(newState));
                }
                return newState;
            });
        } catch (error) {
            console.error('Error:', error);
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    const searchItems = async (searchTerm: string) => {
        setState(prev => ({
            ...prev,
            movies: [],
            heroImage: null,
            loading: true,
            currentPage: 0,
            totalPages: 0,
            searchTerm
        }));

        try {
            const result = searchTerm === "" 
                ? await movieService.getPopularMovies()
                : await movieService.searchMovies(searchTerm);
                
            setState(prev => ({
                ...prev,
                movies: result.results,
                heroImage: result.results[0],
                loading: false,
                currentPage: result.page,
                totalPages: result.total_pages
            }));
        } catch (error) {
            console.error('Error:', error);
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    const loadMoreItems = () => {
        const { searchTerm, currentPage } = state;
        fetchMoreMovies(currentPage + 1, searchTerm);
    };

    const { movies, heroImage, loading, currentPage, totalPages, searchTerm } = state;

    return (
        <div className="rmdb-home">
            {heroImage && (
                <div>
                    <HeroImage
                        image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${heroImage.backdrop_path}`}
                        title={heroImage.original_title}
                        text={heroImage.overview}
                    />
                    <SearchBar callback={searchItems} />
                </div>
            )}
            <div className="rmdb-home-grid">
                <FourColGrid
                    header={searchTerm ? 'Search Result' : 'Popular Movies'}
                    loading={loading}
                >
                    {movies.map((movie: MovieType, i: number) => (
                        <MovieThumb
                            key={i}
                            clickable={true}
                            image={movie.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}` : './images/no_image.jpg'}
                            movieId={movie.id}
                            movieName={movie.original_title}
                        />
                    ))}
                </FourColGrid>
                {loading && <Spinner />}
                {(currentPage <= totalPages && !loading) && (
                    <LoadMoreBtn text="Load More" onClick={loadMoreItems} />
                )}
            </div>
        </div>
    );
};

export default Home;
