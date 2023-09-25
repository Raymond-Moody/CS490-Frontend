import React from 'react';
import axios from 'axios';
import { ErrorContext } from './ErrorContext';

export default function Customers(){
    const [tableCount, setTableCount] = React.useState({start: 1, end: 15});
    const [searchResult, setSearchResult] = React.useState({results: []});
    const [selectedCustomer, setSelectedCustomer] = React.useState(null);
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [custID, setCustID] = React.useState(0);
    const setError = React.useContext(ErrorContext);
    const baseUrl = "http://localhost:8000/customers/"; 

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

    function changePage(dir){
        let url = dir === "next" ? searchResult['next'] : searchResult['previous'];
        let offset = parseInt(url.substring(url.indexOf("offset") + 7)) || 0;
        setTableCount({
            start: offset + 1,
            end: Math.min(searchResult['count'], offset + 15)
        })
        axiosQuery(url);
    }

    function handleSubmit(event){
        event.preventDefault();
        setSelectedCustomer(null);
        let url = baseUrl.concat("?");
        if(firstName !== ""){
            url = url.concat(`&first_name=${firstName}`);
        }
        if(lastName !== ""){
            url = url.concat(`&last_name=${lastName}`);
        }
        if(custID !== 0){
            url = url.concat(`&customer_id=${custID}`);
        }
        axiosQuery(url);
    }

    function handleClick(cust){
        if(!selectedCustomer || selectedCustomer['customer_id'] !== cust['customer_id']){
            setSelectedCustomer(cust);
        } else {
            setSelectedCustomer(null);
        }
    }

    function handleTextChange(event){
        switch(event.target.id){
            case 'first_name':
                setFirstName(event.target.value.trim());
                console.log(firstName);
                break;
            case 'last_name':
                setLastName(event.target.value.trim());
                console.log(lastName);
                break;
             case 'customer_id':
                if(parseInt(event.target.value))
                    setCustID(parseInt(event.target.value));
                else
                    setCustID(0);
                break;
             default:
                break;
        }
    }

    React.useEffect(() => {
        axiosQuery(baseUrl);
    }, [])

    return(
        <div className='content'>
            <div id='search_header'>
                <h1>Search Customers</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <label htmlFor='first_name'>First Name: </label> 
                <input type='text' id='first_name' onChange={handleTextChange} /> 
                <label htmlFor='last_name'>Last Name: </label> 
                <input type='text' id='last_name' onChange={handleTextChange} /> 
                <label htmlFor='customer_id'>ID: </label> 
                <input type='text' id='customer_id' onChange={handleTextChange} /> 
                <input type='submit' value='Search'/>
            </form>
            <div className='list'>
                {searchResult['count'] ? <h3>{`Results ${tableCount['start']}-${Math.min(tableCount['end'],searchResult['count'])} of ${searchResult['count']}`}</h3> : <h3>No results</h3>}
                    <table>
                        <tbody>
                            {
                                searchResult['results'].map(
                                    cust => <tr key={cust['customer_id']} onClick={() => handleClick(cust)}><td className={selectedCustomer && selectedCustomer['customer_id'] === cust['customer_id'] ? "selected":""}>{cust['first_name']} {cust['last_name']}</td></tr>
                                )
                            }
                        </tbody>
                    </table>
                {searchResult['previous'] && <button onClick={() => changePage("prev")}>&lt; Prev</button>}
                {searchResult['next'] && <button onClick={() => changePage("next")}>Next &gt;</button>}
            </div>
            {selectedCustomer && <CustomerInfo custData={selectedCustomer}/>}
        </div>
    );
}

function CustomerInfo({custData}){
    return(
        <div style={{display: "inline-block", paddingLeft: "50px"}}>
            <h1>Customer Information</h1>
            <table>
            <tbody>
                <tr><td>Name: </td><td>{custData['first_name']} {custData['last_name']}</td></tr>
                <tr><td>Email: </td><td>{custData['email']}</td></tr>
                <tr><td>Address: </td><td>{custData['address']}</td></tr>
            </tbody>
            </table>
        </div>
    );
}
