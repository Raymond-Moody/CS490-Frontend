import axios from 'axios';
import React from 'react';

export default function TopActorList(){

    const [actorList, setActorList] = React.useState([]);
    const [renderData, setRenderData] = React.useState(false);
    const [selectedActor, setSelectedActor] = React.useState({});

    function getTopActors(){
        axios
            .get("http://localhost:8000/actors/top")
            .then(response => setActorList(response.data))
            .catch(err => console.log(err));
    }

    function handleClick(id){
        if(selectedActor['actor_id'] === id){
            setRenderData(!renderData);
        } else {
            getActorData(id);
            setRenderData(true);
        }
    }

    function getActorData(actor_id){
        return(
            axios
                .get(`http://localhost:8000/actors/${actor_id}`)
                .then(response => setSelectedActor(response.data))
                .catch(err => console.log(err))
        ); 
    }

    React.useEffect(() => {
        getTopActors();
    }, []);

    return(
        <div>
            <div className="TopActors" style={{display: "inline-block", verticalAlign: "top"}}>
                <h1>Top 5 Actors</h1>
                <ol>
                    {
                        actorList.map(
                            actor => <li key={actor['actor_id']} onClick={() => handleClick(actor['actor_id'])} className={actor['actor_id'] === selectedActor['actor_id'] && renderData ? "selected" : ""}>{actor['first_name']} {actor['last_name']}</li>
                        )
                    }
                </ol>
            </div>
            {renderData && <ActorInfo actorData={selectedActor}/>}
        </div>
    );
}


function ActorInfo({actorData}){
    const [topFilms, setTopFilms] = React.useState([]);
    function getTopFilms(){
        axios
            .get(`http://localhost:8000/actors/${actorData['actor_id']}/top-movies`)
            .then(response => setTopFilms(response.data))
            .catch(err => console.log(err));
    }
    
    React.useEffect(() => {
        console.log(actorData);
        getTopFilms();
    }, [actorData]);

    return(
        <div style={{display: "inline-block", paddingLeft: "50px"}}>
            <h1>{actorData['first_name']} {actorData['last_name']}'s Top 5 Movies</h1>
            <ol>
            {
                topFilms.map(
                    film => <li key={film['film_id']}>{film['title']}</li>
                )
            }
            </ol>
        </div>
    );
}
