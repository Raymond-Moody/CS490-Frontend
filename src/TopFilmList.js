import axios from 'axios';
import React from 'react';
import { ErrorContext } from './ErrorContext';
import FilmInfo from './FilmInfo.js';

export default function TopFilmList(){

    const [filmList, setFilmList] = React.useState([]);
    const [selectedFilm, setSelectedFilm] = React.useState({});
    const [renderData, setRenderData] = React.useState(false);
    const setError = React.useContext(ErrorContext);

    function getFilmData(film_id){
        setError(null);
        return (
            axios
                .get(`http://localhost:8000/films/${film_id}`)
                .then(response => setSelectedFilm(response.data))
                .catch(err => setError(err))
        );
    }

    function handleClick(id){
        if(selectedFilm['film_id'] === id){
            setRenderData(!renderData);
        } else {
            getFilmData(id);
            setRenderData(true);
        }
    }

    React.useEffect(() => {
        setError(null);
        axios
            .get("http://localhost:8000/films/top")
            .then(response => setFilmList(response.data))
            .catch(err => setError(err));
    }, [setError]);

    return(
        <div>
            <div className="TopFilms list">
                <h1>Top 5 Movies</h1>
                <ol>
                    {
                        filmList.map(
                            film => <li key={film['film_id']} onClick={() => handleClick(film['film_id'])} className={film['film_id'] === selectedFilm['film_id'] && renderData ? "selected" : ""}>{film['title']}</li>
                        )
                    }
                </ol>
            </div>
            {renderData && <FilmInfo filmData={selectedFilm}/>}
        </div>
    );
}


