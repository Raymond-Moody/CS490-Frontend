import React from 'react';
import Home from './Home';
import NavBar from './NavBar';
import Movies from './Movies';
import Customers from './Customers';
import {ErrorContext} from './ErrorContext';


export default function App(){
    if(navigator.cookieEnabled && !sessionStorage.getItem("page"))
        sessionStorage.setItem("page", "Home");

    const [currPage, setCurrPage] = React.useState(navigator.cookieEnabled ? sessionStorage.getItem("page") : "Home");
    const [err, setError] = React.useState(null);

    function printError(error){
        if(Array.isArray(error)){
            return (
                     error.map(
                         errText => <div className='content error'>{errText}</div>
                     )
                   );
        } else {
            let msg = '';
            switch(error['code']){
                case 'ERR_NETWORK':
                    msg = "Could not connect to backend.";
                    break;
                default:
                    msg = error['code'];
                    break;
            }
            return <div className='content error'>{msg}</div>
        }
    }

    function pageSelect(){
        switch(currPage){
            case 'Home':
                return <Home />;
            case 'Movies':
                return <Movies />;
            case 'Customers':
                return <Customers />;
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
