import React from 'react';
import axios from 'axios';
import { ErrorContext } from './ErrorContext';

export default function Customers(){
    const baseUrl = "http://localhost:8000/customers/"; 
    const [tableCount, setTableCount] = React.useState({start: 1, end: 15});
    const [searchResult, setSearchResult] = React.useState({results: []});
    const [selectedCustomer, setSelectedCustomer] = React.useState(null);
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [custID, setCustID] = React.useState(0);
    const [url, setUrl] = React.useState(baseUrl);
    const setError = React.useContext(ErrorContext);

    function changePage(dir){
        let pageUrl = dir === "next" ? searchResult['next'] : searchResult['previous'];
        let offset = parseInt(pageUrl.substring(pageUrl.indexOf("offset") + 7)) || 0;
        setTableCount({
            start: offset + 1,
            end: Math.min(searchResult['count'], offset + 15)
        })
        setUrl(pageUrl);
    }

    function handleSubmit(event){
        event.preventDefault();
        setSelectedCustomer(null);
        let searchUrl = baseUrl.concat("?");
        if(firstName !== ""){
            searchUrl = searchUrl.concat(`&first_name=${firstName}`);
        }
        if(lastName !== ""){
            searchUrl = searchUrl.concat(`&last_name=${lastName}`);
        }
        if(custID !== 0){
            searchUrl = searchUrl.concat(`&customer_id=${custID}`);
        }
        setUrl(searchUrl)
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

    function createCustomer(event){
        event.preventDefault();
        let fname = event.target[0].value
        let lname = event.target[1].value
        let email = event.target[2].value
        let address = event.target[3].value
        let city = event.target[4].value
        let country = event.target[5].value
        if(!fname || !lname || !email || !address || !city || !country){
            window.alert("Please fill out all fields");
        }
        console.log(event);
        console.log(fname);
    }

    React.useEffect(() => {
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
            {selectedCustomer && <CustomerInfo custData={selectedCustomer} setSelectedCustomer={setSelectedCustomer} setUrl={setUrl}/>}
            <br/>
            <h1>Create New Customer</h1>
            <form onSubmit={createCustomer}>
                <table><tbody>
                    <tr><td>First Name:</td><td><input type='text' style={{backgroundColor : "transparent"}}/></td></tr>
                    <tr><td>Last Name:</td><td><input type='text' style={{backgroundColor : "transparent"}}/></td></tr>
                    <tr><td>Email:</td><td><input type='text' style={{backgroundColor : "transparent"}}/></td></tr>
                    <tr><td>Address:</td><td><input type='text' style={{backgroundColor : "transparent"}}/></td></tr>
                    <tr><td>City:</td><td><input type='text' style={{backgroundColor : "transparent"}}/></td></tr>
                    <tr><td>Country:</td><td><input type='text' style={{backgroundColor : "transparent"}}/></td></tr>
                </tbody></table>
                <input type='submit' value='Create Customer'/>
            </form>
        </div>
    );
}

function CustomerInfo({custData, setSelectedCustomer, setUrl}){
    const [rentals, setRentals] = React.useState({});

    function deleteCust(){
        if(window.confirm(`Delete ${custData['first_name']} ${custData['last_name']}?\nThis cannot be undone.`)){
            console.log("Confirmed");
            axios
                .delete(`http://localhost:8000/customers/${custData['customer_id']}`)
                .then(() => {setSelectedCustomer(null); setUrl("http://localhost:8000/customers")})
                .catch(err => console.log(err));
        } else {
            console.log("Did not delete");
        }
    }

    function returnFilm(rental_id){
        let datetime = new Date().toISOString();
        axios
            .get(`http://localhost:8000/rentals/${rental_id}`)
            .then(response => {
                                let rental = response.data;
                                rental['return_date'] = datetime;
                                axios
                                    .put(`http://localhost:8000/rentals/${rental_id}/`, rental)
                                    //Find the index of rental in rentals and remove it to update the rental listings
                                    .then(() => {
                                                    setRentals(rentals.toSpliced(rentals.findIndex(r => r['rental_id'] === rental['rental_id']), 1)); 
                                                    alert(`${custData['first_name']} ${custData['last_name']} returned ${rental['inventory']['film']['title']} successfully`);
                                                })
                                    .catch(err => console.log(err));
                              })
            .catch(err => console.log(err));
    }

    React.useEffect(() => {
        axios
            .get(`http://localhost:8000/customers/${custData['customer_id']}/rentals`)
            .then(response => setRentals(response.data))
            .catch(err => console.log(err));
    }, [custData]);

    return(
        <div style={{display: "inline-block", paddingLeft: "50px"}}>
            <h1>Customer Information</h1>
            <table><tbody>
                <tr><td>Name: </td><td>{custData['first_name']} {custData['last_name']}</td></tr>
                <tr><td>Email: </td><td>{custData['email']}</td></tr>
                <tr><td>Phone Number: </td><td>{custData['address']['phone']}</td></tr>
                <tr><td>Address: </td><td>{custData['address']['address']}, {custData['address']['district']}, {custData['address']['postal_code']}</td></tr>
                <tr><td>City: </td><td>{custData['address']['city']['city']}</td></tr>
                <tr><td>Country: </td><td>{custData['address']['city']['country']['country']}</td></tr>
            </tbody></table>
            <button>Edit</button> <button onClick={deleteCust}>Delete</button>

            
            {rentals.length > 0 && 
                <>
                <h2>Rentals</h2>
                <table><tbody>
                {
                    rentals.map(
                        rental => <tr key={rental['rental_id']}><td>{rental['inventory']['film']['title']}</td><td><button onClick={() => returnFilm(rental['rental_id'])}>Return</button></td></tr>
                    )
                }
                </tbody></table>
                </>
            }
        </div>
    );
}
