import React from "react";
import {Page, Text, Document, StyleSheet, View} from '@react-pdf/renderer';

const style = StyleSheet.create({
    title: {textAlign: 'center', textDecoration: 'underline', marginBottom: '5px'},
    table: {marginLeft: '20px', marginTop: '0px', paddingTop: '0px', border: '1px solid black', display: 'flex', alignSelf: 'center', flexDirection: 'column', width: '85%'},
    tr: {flexDirection: 'row', border: '1px, solid, black', justifyContent: 'space-around', alignSelf: 'start', margin: '5px'},
    td: {fontSize: '12px', flex: 1},
    th: {textDecoration: 'underline', fontSize: '14px', flex: 1},
    page: {flexDirection: 'column'}
});

function formatDate(date){
    let fields = date.split("-");
    let day = fields[2].substring(0,2);
    let time = fields[2].substring(3,11);
    return `${fields[1]}/${day}/${fields[0]} ${time}`;
}

export default function Report({data}){
    return(
        <Document>
                {
                    data.map(
                        page => 
                        <>
                        {page.map(
                            cust => {return (cust['rentals'].length > 0 ? (<Page wrap={false}> 
                                        <Text style={style.title}>Customer</Text>
                                        <View style={style.table}>
                                        <View style={style.tr}>
                                            <Text style={style.td}>ID: {cust['customer_id']}</Text>
                                        </View>
                                        <View style={style.tr}>
                                            <Text style={style.td}>Name: {cust['first_name']} {cust['last_name']}</Text>
                                        </View>
                                        <View style={style.tr}>
                                            <Text style={style.td}>Email: {cust['email']}</Text>
                                        </View>
                                        <View style={style.tr}>
                                            <Text style={style.td}>Phone: {cust['address']['phone']}</Text>
                                        </View>
                                        <View style={style.tr}>
                                            <Text style={style.td}>Address: {cust['address']['address']},{cust['address2'] ? ` ${cust['address2']},` : null} {cust['address']['district']} {cust['address']['postal_code']}</Text>
                                        </View>
                                        <View style={style.tr}>
                                            <Text style={style.td}>City: {cust['address']['city']['city']}, {cust['address']['city']['country']['country']}</Text>
                                        </View>
                                        <View style={style.tr}>
                                            <Text style={style.td}>Registered: {formatDate(cust['create_date'])}</Text>
                                        </View>
                                        <View style={style.tr}>
                                            <Text style={style.td}>Total Rentals: {cust['rentals'].length}</Text>
                                        </View>
                                        </View>
                                        <Text style={style.title}>Rentals</Text>
                                        <View style={style.table}>
                                            <View style={style.tr}>
                                                <Text style={style.th}>Title</Text>
                                                <Text style={style.th}>Rental Date</Text>
                                                <Text style={style.th}>Return Date</Text>
                                            </View>
                                            {
                                                cust['rentals'].map(
                                                    rental =>
                                                        <View style={style.tr}>
                                                            <Text style={style.td}>{rental['inventory']['film']}</Text>
                                                            <Text style={style.td}>{formatDate(rental['rental_date'])}</Text>
                                                            <Text style={style.td}>{rental['return_date'] ? formatDate(rental['return_date']) : "----------"}</Text>
                                                        </View>
                                                )
                                            }
                                        </View>
                                    </Page>) : null); }
                        )}
                        </>
                    )
                }
        </Document>
    );
}
