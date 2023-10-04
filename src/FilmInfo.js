import React from 'react';
import axios from 'axios';
import { ErrorContext } from './ErrorContext';

export default function FilmInfo({ filmData }){
    const setError = React.useContext(ErrorContext);
    const [inventory, setInventory] = React.useState({copies : 0});
    const [custID, setCustID] = React.useState(0);
    const [staffID, setStaffID] = React.useState(0);

    function rent(event){
        event.preventDefault();
        if(staffID === 0){
            alert("Please enter a valid staff id");
            return;
        }
        if(custID !== 0){
            let datetime = new Date().toISOString();
            let rental = {
                'rental_date' : datetime,
                'inventory_id' : inventory['inventory'][0]['inventory_id'],
                'customer_id' : custID, 
                'return_date' : null,
                'staff_id' : staffID,
                'last_update' : datetime

            }

            axios
                .post(`http://localhost:8000/rentals/`, rental)
                .then(() => {
                        alert(`Rented ${filmData['title']} to customer with ID ${custID}`);
                        axios
                            .get(`http://localhost:8000/films/${filmData['film_id']}/inventory`)
                            .then(response => setInventory(response.data))
                            .catch(err => setError(err));
                    })
                .catch(err => {
                            if(err['code'] === "ERR_BAD_REQUEST"){
                                if(err.response.data === "customer_id")
                                    alert(`Customer with ID ${custID} does not exist.`);
                                else if(err.response.data === "staff_id")
                                    alert(`Staff with ID ${staffID} does not exist.`);
                                else
                                    setError(err);
                            }
                            else
                                setError(err);
                        });
        } else {
            alert("Please enter a valid customer ID");
        }
    }

    function handleIDChange(event){
        let id = parseInt(event.target.value);
        if(parseInt(event.target.value)){
            setCustID(id);
        } else {
            setCustID(0);
        }
    }

    function handleStaffChange(event){
        let id = parseInt(event.target.value);
        if(parseInt(event.target.value)){
            setStaffID(id);
        } else {
            setStaffID(0);
        }
    }

    React.useEffect(() => {
        //setCustID(0);
        axios
            .get(`http://localhost:8000/films/${filmData['film_id']}/inventory`)
            .then(response => setInventory(response.data))
            .catch(err => setError(err));
    }, [filmData, setError]);

    return (
        <div className="FilmInfo" style={{display: "inline-block", paddingLeft: "50px"}}>
            <h1>Film Information</h1>
            <table> <tbody>
                    <tr><td>Title:</td><td>{filmData['title']}</td></tr>
                    <tr><td>Description:</td><td>{filmData['description']}</td></tr>
                    <tr><td>Language:</td><td>{filmData['language']}</td></tr>
                    {filmData['original_language'] === null ? null : (<tr><td>Original Language:</td><td>{filmData['original_language']}</td></tr>)}
                    <tr><td>Release Year:</td><td>{filmData['release_year']}</td></tr>
                    <tr><td>Length:</td><td>{filmData['length']} minutes</td></tr>
                    <tr><td>Rating:</td><td>{filmData['rating']}</td></tr>
                    <tr><td>Categories:</td><td>{filmData['categories']}</td></tr>
                    <tr><td>Special Features:</td><td>{filmData['special_features']}</td></tr>
                    <tr><td>Rental Duration:</td><td>{filmData['rental_duration']} days</td></tr>
                    <tr><td>Rental Rate:</td><td>${filmData['rental_rate']}</td></tr>
                    <tr><td>Replacement Cost:</td><td>${filmData['replacement_cost']}</td></tr>
                    <tr><td>Available Copies:</td><td>{inventory['copies']}</td></tr>
                </tbody> </table>
            {inventory['copies'] > 0 && 
                <>
                <h2>Rent this film</h2>
                <form className="inputForm" onSubmit={rent}>
                    <label style={{marginRight: "10px"}} htmlFor='renter_id'>Customer ID:</label>
                    <input type='text' id='renter_id' onChange={handleIDChange}/>
                    <label style={{marginRight: "10px"}} htmlFor='staff_id'>Staff ID:</label>
                    <input type='text' id='staff_id' onChange={handleStaffChange}/>
                    <input type='submit'value='rent' />
                </form>
                </>
            }
        </div>
    );
}
