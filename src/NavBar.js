import React from 'react';

export default function NavBar({pageTitle, setPage}){

    return(
        <div className='navbar'>
            <h1 className="navHeader">{pageTitle}</h1>
            <nav>
                <p onClick={() => setPage("Home")}>Home</p>
                <p onClick={() => setPage("Movies")}>Movies</p>
                <p onClick={() => setPage("Customers")}>Customers</p>
                <p onClick={() => setPage("Report")}>Report</p>
            </nav>
        </div>
    );
}
