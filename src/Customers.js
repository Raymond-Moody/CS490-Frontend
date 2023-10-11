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
    const [update, setUpdate] = React.useState(0);
    const setError = React.useContext(ErrorContext);

    function objToArray(obj){
        let retArray = [];
        Object.keys(obj).forEach((key) => {
            let val = obj[key];
            if(typeof val === 'object' && !Array.isArray(val)){
                val = objToArray(val);
                for(let i = 0; i < val.length; i++)
                    retArray.push(val[i]);
            } else {
                retArray.push(`Field ${key} : ${val[0]}`);
            }
        });
        return retArray;
    }

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
        setTableCount({start: 1, end: 15});
        setUrl(searchUrl);
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
                break;
            case 'last_name':
                setLastName(event.target.value.trim());
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
        let fname = event.target[0].value.trim();
        let lname = event.target[1].value.trim();
        let email = event.target[2].value.trim() ? event.target[2].value.trim() : null;
        let phone = event.target[3].value.trim();
        let address = event.target[4].value.trim();
        let address2 = event.target[5].value.trim() ? event.target[5].value.trim() : null;
        let district = event.target[6].value.trim();
        let zip = event.target[7].value.trim() ? event.target[7].value.trim() : null;
        let city = event.target[8].value.trim();
        let country = event.target[9].value.trim();
        let create_date = new Date().toISOString();
        if(!fname || !lname || !address || !district || !city || !country || !phone){
            window.alert("Please fill out all required fields");
            return;
        }

        let new_customer = {
            'first_name' : fname,
            'last_name' : lname,
            'email' : email,
            'address' : {
                          'address' : address,
                          'address2' : address2,
                          'district' : district,
                          'postal_code' : zip,
                          'phone' : phone,
                          'city' : {
                                     'city' : city,
                                     'country' : {'country' : country}
                                   }
                        },
            'create_date' : create_date,
            'rentals' : []
        }

        axios
            .post(`http://localhost:8000/customers/`, new_customer)
            .then(response => {
                setError(null);
                alert(`Created customer with ID ${response['data']['customer_id']}.`);
                event.target.reset()
            })
            .catch(err => {
                setError(objToArray(err['response']['data']));
            });
    }


    React.useEffect(() => {
        axios
            .get(url)
            .then(response => {
                setSearchResult(response.data);
            })
            .catch(err => setError(err));
    }, [url, setError, update])

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
            {selectedCustomer && <CustomerInfo custData={selectedCustomer} setSelectedCustomer={setSelectedCustomer} setUrl={setUrl} setUpdate={setUpdate} objToArray={objToArray}/>}
            <br/>
            <h1>Create New Customer</h1>
            <form className="inputForm" onSubmit={createCustomer}>
                <label>First Name:*</label><input type='text' />
                <label>Last Name:*</label><input type='text' />
                <label>Email:</label><input type='text' />
                <label>Phone Number:*</label><input type='text' />
                <label>Address:*</label><input type='text' />
                <label>Address Line 2:</label><input type='text' />
                <label>District:*</label><input type='text' />
                <label>Zip Code:</label><input type='text' />
                <label>City:*</label><input type='text' />
                <label>Country:*</label><input type='text' />
                <input type='submit' value='Create Customer'/>
            </form>
        </div>
    );
}

function CustomerInfo({custData, setSelectedCustomer, setUrl, setUpdate, objToArray}){
    const [editing, setEditing] = React.useState(false);
    const setError = React.useContext(ErrorContext);

    function deleteCust(){
        if(window.confirm(`Delete ${custData['first_name']} ${custData['last_name']}?\nThis cannot be undone.`)){
            axios
                .delete(`http://localhost:8000/customers/${custData['customer_id']}`)
                .then(() => {setSelectedCustomer(null); setUrl("http://localhost:8000/customers")})
                .catch(err => setError(err));
        }
    }

    function returnFilm(rental_id){
        let datetime = new Date().toISOString();
        axios
            .get(`http://localhost:8000/rentals/${rental_id}`)
            .then(response => {
                                let rental = response.data;
                                rental['return_date'] = datetime;
                                rental['last_update'] = datetime;
                                axios
                                    .put(`http://localhost:8000/rentals/${rental_id}/`, rental)
                                    .then(() => {
                                                    setUpdate(update => update+1);
                                                    setSelectedCustomer(null);
                                                    alert(`${custData['first_name']} ${custData['last_name']} returned ${rental['inventory']['film']} successfully`);
                                                })
                                    .catch(err => setError(err));
                              })
            .catch(err => setError(err));
    }

    function formatDate(date){
        let fields = date.split("-");
        let day = fields[2].substring(0,2);
        let time = fields[2].substring(3,11);
        return `${fields[1]}/${day}/${fields[0]} ${time}`;
    }

    function editCustomer(event){
        event.preventDefault();
        let addressChanged = false;
        let datetime = new Date().toISOString();
        let data = {};
        let newAddress = {};
        for (let i = 0; i < 3; i++){
            if(event.target[i].value.trim()){
                data[event.target[i].name] = event.target[i].value.trim();
            }
        }
        for (let i = 3; i < 8; i++){
            if(event.target[i].value.trim()){
                newAddress[event.target[i].name] = event.target[i].value.trim();
                addressChanged = true;
            } else {
                newAddress[event.target[i].name] = event.target[i].placeholder ? event.target[i].placeholder : null;
            }
        }

        newAddress['city'] = {
                              'city': event.target[8].value.trim() ? event.target[8].value.trim() : event.target[8].placeholder,
                              'country' : { 'country' : event.target[9].value.trim() ? event.target[9].value.trim() : event.target[9].placeholder}
                             };

        if(event.target[8].value.trim() || event.target[9].value.trim())
            addressChanged = true;

        if(addressChanged){
            data['address'] = newAddress;
        }

        if(Object.keys(data).length !== 0){
            data['last_update'] = datetime;
            axios
                .patch(`http://localhost:8000/customers/${custData['customer_id']}/`, data)
                .then(response => {
                    setError(null);
                    alert(`Updated customer ${response.data['customer_id']}`);
                    setSelectedCustomer(null); 
                    setUrl(`http://localhost:8000/customers/?&customer_id=${response.data['customer_id']}&`);
                })
                .catch(err => {
                    console.log(err);
                    setError(objToArray(err['response']['data']));
                });
        }
    }

    return(
            <div style={{display: "inline-block", paddingLeft: "50px"}}>
            {editing 
            ? <>
                <h1>Edit Customer Information</h1>
                <form className='inputForm' onSubmit={editCustomer}>
                    <label>First Name:</label><input type='text' name='first_name' placeholder={custData['first_name']}/>
                    <label>Last Name:</label><input type='text' name='last_name' placeholder={custData['last_name']}/>
                    <label>Email:</label><input type='text' name='email' placeholder={custData['email']}/>
                    <label>Phone Number:</label><input type='text' name='phone' placeholder={custData['address']['phone']}/>
                    <label>Address:</label><input type='text' name='address' placeholder={custData['address']['address']}/>
                    <label>Address Line 2:</label><input type='text' name='address2' placeholder={custData['address']['address2']} />
                    <label>District:</label><input type='text' name='district' placeholder={custData['address']['district']}/>
                    <label>Zip Code:</label><input type='text' name='postal_code' placeholder={custData['address']['postal_code']} />
                    <label>City:</label><input type='text' name='city' placeholder={custData['address']['city']['city']}/>
                    <label>Country:</label><input type='text' name='country' placeholder={custData['address']['city']['country']['country']}/>
                    <button onClick={() => setEditing(false)}>Cancel</button><input type='submit' value='Edit Customer'/>
                </form>
            </> 
            :<>
                <h1>Customer Information</h1>
                <table><tbody>
                    <tr><td>Customer ID: </td><td>{custData['customer_id']}</td></tr>
                    <tr><td>Name: </td><td>{custData['first_name']} {custData['last_name']}</td></tr>
                    <tr><td>Email: </td><td>{custData['email']}</td></tr>
                    <tr><td>Phone Number: </td><td>{custData['address']['phone']}</td></tr>
                    <tr><td>Address: </td><td>{custData['address']['address']}, {custData['address']['district']}, {custData['address']['postal_code']}</td></tr>
                    <tr><td>City: </td><td>{custData['address']['city']['city']}</td></tr>
                    <tr><td>Country: </td><td>{custData['address']['city']['country']['country']}</td></tr>
                </tbody></table>
                <button onClick={() => setEditing(true)}>Edit</button> <button onClick={deleteCust}>Delete</button>
            </>
            }

            {custData['rentals'].length > 0 && 
                <>
                <h2>Rentals</h2>
                <table><tbody>
                <tr><th>Title</th><th>Return date</th></tr>
                {
                    custData['rentals'].map(
                        rental => <tr key={rental['rental_id']}>
                                    <td>{rental['inventory']['film']}</td>
                                    <td>{rental['return_date'] === null ? <button onClick={() => returnFilm(rental['rental_id'])}>Return</button> : formatDate(rental['return_date'])}</td>
                                  </tr>
                    )
                }
                </tbody></table>
                </>
            }
        </div>
    );
}
