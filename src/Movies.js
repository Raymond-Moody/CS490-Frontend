import React from 'react';
import axios from 'axios';
import FilmInfo from './FilmInfo';
import { ErrorContext } from './ErrorContext';

export default function Movies(){
    const baseUrl = "http://localhost:8000/films/"; 
    const [param, setParam] = React.useState('title'); //title, genre, or actor
    const [queryText, setQueryText] = React.useState('');
    const [searchResult, setSearchResult] = React.useState({results: []});
    const [selectedFilm, setSelectedFilm] = React.useState(null);
    const [tableCount, setTableCount] = React.useState({start: 1, end: 15});
    const [url, setUrl] = React.useState(baseUrl);
    const setError = React.useContext(ErrorContext);

    /*
    function axiosQuery(url){
        setError(null);
        axios
            .get(url)
            .then(response => {
                setSearchResult(response.data)
            })
            .catch(err => setError(err));
        //console.log(searchResult);
    }
    */

    function getFilmList(query){
        if(query.trim() !== ""){
            let parameterList = [];
            let queries = query.split(",");
            queries.forEach(parameter => parameterList.push(parameter.trim()));
            let urlParams = "?";
            parameterList.forEach((paramValue) => {
                urlParams = urlParams.concat(`&${param}=${paramValue}`);
            }); 
            //axiosQuery(baseUrl.concat(urlParams));
            setUrl(baseUrl.concat(urlParams));
        }
        else{
            setError(null);
            //axiosQuery(baseUrl);
            setUrl(baseUrl);
        }
    }

    function handleSelectChange(event){
        setParam(event.target.value);
    }

    function handleTextChange(event){
        setQueryText(event.target.value);
    }

    function handleSubmit(event){
        event.preventDefault();
        getFilmList(queryText);
    }

    function handleClick(film){
        if(!selectedFilm || selectedFilm['film_id'] !== film['film_id']){
            setSelectedFilm(film);
        } else {
            setSelectedFilm(null);
        }
    }

    function changePage(dir){
        let pageUrl = dir === "next" ? searchResult['next'] : searchResult['previous'];
        let offset = parseInt(pageUrl.substring(pageUrl.indexOf("offset") + 7)) || 0;
        setTableCount({
            start: offset + 1,
            end: Math.min(searchResult['count'], offset + 15)
        })
        //axiosQuery(url);
        setUrl(pageUrl);
    }

    React.useEffect(() => {
        setError(null);
        axios
            .get(url)
            .then(response => {
                setSearchResult(response.data)
            })
            .catch(err => setError(err));
    }, [url, setError])

    return(
        <div className='content'>
            <div id='search_header'>
                <h1 style={{display: "inline"}}>Search Movies by </h1>
                <select id='param_select' onChange={handleSelectChange}>
                    <option value='title'>Title</option>
                    <option value='genre'>Genre</option>
                    <option value='actor'>Actor</option>
                </select>
            </div>
            <form onSubmit={handleSubmit}>
                <input type='text' id='movie_search' placeholder='title1, title2, etc' onChange={handleTextChange}/>
                <input type='submit' value='Search'/>
            </form>
            <div className="list">
            {searchResult['count'] ? <h3>{`Results ${tableCount['start']}-${Math.min(tableCount['end'], searchResult['count'])} of ${searchResult['count']}`}</h3> : <h3>No results</h3>}
                <table>
                    <tbody>
                        {
                            searchResult['results'].map(
                                film => <tr key={film['film_id']} onClick={() => handleClick(film)}><td className={selectedFilm && selectedFilm['film_id'] === film['film_id'] ? "selected":""}>{film['title']}</td></tr>
                            )
                        }
                    </tbody>
                </table>
                {searchResult['previous'] && <button onClick={() => changePage("prev")}>&lt; Prev</button>}
                {searchResult['next'] && <button onClick={() => changePage("next")}>Next &gt;</button>}
            </div>
            {selectedFilm && <FilmInfo filmData={selectedFilm}/>}
        </div>
    );
}
