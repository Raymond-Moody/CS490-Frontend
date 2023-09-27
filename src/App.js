import React from 'react';
import Home from './Home';
import NavBar from './NavBar';
import Movies from './Movies';
import Customers from './Customers';
import {ErrorContext} from './ErrorContext';


export default function App(){
    if(!sessionStorage.getItem("page"))
        sessionStorage.setItem("page", "Home");

    const [currPage, setCurrPage] = React.useState(sessionStorage.getItem("page"));
    const [err, setError] = React.useState(null);

    function printError(error){
        console.log(error);
        return <div className='content'>{err['code']}</div>
    }

    function pageSelect(){
        switch(currPage){
            case 'Home':
                return <Home />;
            case 'Movies':
                return <Movies />;
            case 'Customers':
                return <Customers />;
            case 'Report':
                return <p>Report page</p>;
            default:
                return <Home />;
        }
    }

    return(
        <div className="App">
            <ErrorContext.Provider value={setError}>
                <NavBar pageTitle={currPage} setPage={setCurrPage}/>
                {err && printError(err)}
                {pageSelect()}
            </ErrorContext.Provider>
        </div>
    );
}
