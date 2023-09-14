import axios from 'axios';
import React from 'react';

class App extends React.Component{

    constructor(props){
        super(props);
        this.state = {status : ""};
    }

    healthCheck = () => {
        axios
            .get("http://localhost:8000/api/rest")
            .then(response => this.setState({status : response.data.message}))
            .catch(err => console.log(err));
    }

    render(){
        return (
            <div className="App">
                <h2>Health Check</h2>
                <div id="status">{this.state.status}</div>
                <button onClick={this.healthCheck}>Test Backend</button>
            </div>
        );
    }
}


export default App;
