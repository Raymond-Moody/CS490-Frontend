import React from 'react';
import Home from './Home';
import NavBar from './NavBar';

export default function App(){
    const [currPage, setCurrPage] = React.useState("Home");

    function pageSelect(){
        switch(currPage){
            case 'Home':
                return <Home />;
            case 'Movies':
                return <p>Movie page</p>;
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
            <NavBar pageTitle={currPage} setPage={setCurrPage}/>
            {pageSelect()}
        </div>
    );
}
