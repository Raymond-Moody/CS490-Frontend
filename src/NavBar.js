import React from 'react';
import { ErrorContext } from './ErrorContext';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import Report from './Report';
import axios from 'axios';

export default function NavBar({pageTitle, setPage}){
    const [pdfDone, setDone] = React.useState(false);
    const [custData, setCustData] = React.useState([]);

    const setError = React.useContext(ErrorContext);

    function setCurrPage(page){
        setError(null);
        if(navigator.cookieEnabled)
            sessionStorage.setItem("page", page);
        setPage(page);
    }
    
    function getCustomers(url){
        axios
            .get(url)
            .then(response => {
                custData.push(response.data['results']);
                //console.log(custData);
                if(response.data['next']){
                    getCustomers(response.data['next']);
                } else {
                    setCustData([...custData]);
                    setDone(true);
                }
            })
            .catch(err => console.log(err));
    }

    const generatePdf = async () =>{
        const blob = await pdf((
            <Report data={custData}/>
        )).toBlob();
        saveAs(blob, 'Customer Report');
    };

    if(custData.length === 0){
        getCustomers('http://localhost:8000/customers/?limit=100');
    }

    return(
        <div className='navbar'>
            <h1 className="navHeader">{pageTitle}</h1>
            <nav>
                <p onClick={() => setCurrPage("Home")}>Home</p>
                <p onClick={() => setCurrPage("Movies")}>Movies</p>
                <p onClick={() => setCurrPage("Customers")}>Customers</p>
                {pdfDone ?
                    <p onClick={generatePdf}>Download Report</p>
                    : <p>Loading Report..</p>
                }
            </nav>
        </div>
    );
}

