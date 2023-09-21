import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

export default function App(){

/* Old milestone 1 code
    const [status, setStatus] = useState('');
    function healthCheck() {
        axios
            .get("http://localhost:8000/rest")
            .then(response => setStatus(response.data.message))
            .catch(err => console.log(err));
    }

    return(
            <div className="App">
                <h2>Health Check</h2>
                <div id="status">{status}</div>
                <button onClick={healthCheck}>Test Backend</button>
            </div>
    )
*/
    const [filmList, setFilmList] = useState([]);
    const [selectedFilm, setSelectedFilm] = useState(0);
    const [renderData, setRenderData] = useState(false);
    
    function getTopFilms(){
        axios
            .get("http://localhost:8000/films/top-movies")
            .then(response => setFilmList(response.data))
            .catch(err => console.log(err));
    }

    function handleClick(id){
        if(selectedFilm === id){
            setRenderData(!renderData);
        } else {
            setSelectedFilm(id);
            setRenderData(true);
        }
    }

    useEffect(() => {
        getTopFilms();
    }, []);

    return(
        <div className="App">
            <h1>Top 5 Movies</h1>
            <ol>
                {
                    filmList.map(
                        film => <li key={film['film_id']} onClick={() => handleClick(film['film_id'])}>{film['title']}</li>
                    )
                }
            </ol>
            {renderData && <FilmInfo id={selectedFilm}/>}
        </div>
    );
}

function FilmInfo({ id }){
    const [filmData, setFilmData] = useState({});

    function getFilmData(id){
        axios
            .get(`http://localhost:8000/films/${id}`)
            .then(response => setFilmData(response.data))
            .catch(err => console.log(err));
    }

    return (
        <div className="FilmInfo">
            {getFilmData(id)}
            <table>
                <tr><td>Title: </td><td>{filmData['title']}</td></tr>
                <tr><td>Description: </td><td>{filmData['description']}</td></tr>
                <tr><td>Release Year: </td><td>{filmData['release_year']}</td></tr>
                <tr><td>Length: </td><td>{filmData['length']} minutes</td></tr>
                <tr><td>Rating: </td><td>{filmData['rating']}</td></tr>
                <tr><td>Special Features: </td><td>{filmData['special_features']}</td></tr>
            </table>
        </div>
    );
}
