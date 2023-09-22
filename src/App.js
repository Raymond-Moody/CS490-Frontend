import axios from 'axios';
import React from 'react';

export default function App(){

    const [filmList, setFilmList] = React.useState([]);
    const [selectedFilm, setSelectedFilm] = React.useState({});
    const [renderData, setRenderData] = React.useState(false);
    
    function getTopFilms(){
        axios
            .get("http://localhost:8000/films/top-movies")
            .then(response => setFilmList(response.data))
            .catch(err => console.log(err));
    }

    function getFilmData(film_id){
        return (
        axios
            .get(`http://localhost:8000/films/${film_id}`)
            .then(response => setSelectedFilm(response.data))
            .catch(err => console.log(err))
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
            {renderData && <FilmInfo filmData={selectedFilm}/>}
        </div>
    );
}

function FilmInfo({ filmData }){
    return (
        <div className="FilmInfo">
            <table>
                <tbody>
                    <tr><td>Title: </td><td>{filmData['title']}</td></tr>
                    <tr><td>Description: </td><td>{filmData['description']}</td></tr>
                    <tr><td>Release Year: </td><td>{filmData['release_year']}</td></tr>
                    <tr><td>Length: </td><td>{filmData['length']} minutes</td></tr>
                    <tr><td>Rating: </td><td>{filmData['rating']}</td></tr>
                    <tr><td>Special Features: </td><td>{filmData['special_features']}</td></tr>
                </tbody>
            </table>
        </div>
    );
}
