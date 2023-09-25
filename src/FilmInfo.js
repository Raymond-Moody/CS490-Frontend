import React from 'react';

export default function FilmInfo({ filmData }){
    return (
        <div className="FilmInfo" style={{display: "inline-block", paddingLeft: "50px"}}>
            <h1>Film Information</h1>
            <table>
                <tbody>
                    <tr><td>Title: </td><td>{filmData['title']}</td></tr>
                    <tr><td>Description: </td><td>{filmData['description']}</td></tr>
                    <tr><td>Language: </td><td>{filmData['language']}</td></tr>
                    {filmData['original_language'] === null ? "" : <tr><td>Original Language:</td><td>{filmData['original_language']}</td></tr>}
                    <tr><td>Release Year: </td><td>{filmData['release_year']}</td></tr>
                    <tr><td>Length: </td><td>{filmData['length']} minutes</td></tr>
                    <tr><td>Rating: </td><td>{filmData['rating']}</td></tr>
                    <tr><td>Categories: </td><td>{filmData['categories']}</td></tr>
                    <tr><td>Special Features: </td><td>{filmData['special_features']}</td></tr>
                    <tr><td>Rental Duration: </td><td>{filmData['rental_duration']} days</td></tr>
                    <tr><td>Rental Rate: </td><td>${filmData['rental_rate']}</td></tr>
                    <tr><td>Replacement Cost: </td><td>${filmData['replacement_cost']}</td></tr>
                </tbody>
            </table>
        </div>
    );
}
