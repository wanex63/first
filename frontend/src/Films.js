import React, { useEffect, useState } from 'react';
import { getFilms } from './api';

function Films() {
    const [films, setFilms] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getFilms();
                setFilms(response.data);
            } catch (error) {
                console.error('Error fetching films:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            {films.map(film => (
                <div key={film.id}>
                    <h3>{film.title} ({film.year})</h3>
                    <p>Rating: {film.rating}</p>
                </div>
            ))}
        </div>
    );
}