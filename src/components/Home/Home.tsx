import React, { useState, useEffect } from 'react';
import { API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE, BACKDROP_SIZE } from '../../config';
import HeroImage from '../elements/HeroImage/HeroImage';
import SearchBar from '../elements/SearchBar/SearchBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import MovieThumb from '../elements/MovieThumb/MovieThumb';
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn';
import Spinner from '../elements/Spinner/Spinner';
import './Home.css';

interface MovieType {
    id: number;
    original_title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    [key: string]: any;
}

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
            fetchItems(`${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
        }
    }, []);

    const fetchItems = async (endpoint: string) => {
        setState(prev => ({ ...prev, loading: true }));
        
        try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const result = await response.json();
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

    const searchItems = (searchTerm: string) => {
        const endpoint = searchTerm === "" 
            ? `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`
            : `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}`;

        setState({
            movies: [],
            heroImage: null,
            loading: true,
            currentPage: 0,
            totalPages: 0,
            searchTerm
        });

        fetchItems(endpoint);
    };

    const loadMoreItems = () => {
        const { searchTerm, currentPage } = state;
        const endpoint = searchTerm === ''
            ? `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${currentPage + 1}`
            : `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}&page=${currentPage + 1}`;
        
        fetchItems(endpoint);
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
