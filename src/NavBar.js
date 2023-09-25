import React from 'react';
import { ErrorContext } from './ErrorContext';

export default function NavBar({pageTitle, setPage}){

    const setError = React.useContext(ErrorContext);

    function setCurrPage(page){
        setError(null);
        sessionStorage.setItem("page", page);
        setPage(page);
    }
    
    return(
        <div className='navbar'>
            <h1 className="navHeader">{pageTitle}</h1>
            <nav>
                <p onClick={() => setCurrPage("Home")}>Home</p>
                <p onClick={() => setCurrPage("Movies")}>Movies</p>
                <p onClick={() => setCurrPage("Customers")}>Customers</p>
                <p onClick={() => setCurrPage("Report")}>Report</p>
            </nav>
        </div>
    );
}
