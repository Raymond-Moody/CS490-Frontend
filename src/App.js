import React from 'react';
import Home from './Home';
import NavBar from './NavBar';
import Movies from './Movies';
import {ErrorContext} from './ErrorContext';


export default function App(){
    if(!sessionStorage.getItem("page"))
        sessionStorage.setItem("page", "Home");

    const [currPage, setCurrPage] = React.useState(sessionStorage.getItem("page"));
    const [err, setError] = React.useState(null);


    function pageSelect(){
        if(err){
            return <div className='content'>Error connecting to backend</div>;
        }

        switch(currPage){
            case 'Home':
                return <Home />;
            case 'Movies':
                return <Movies />;
            case 'Customers':
                return <p>Customer page</p>;
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
                {pageSelect()}
            </ErrorContext.Provider>
        </div>
    );
}
