import React from 'react';
import TopFilmList from './TopFilmList';
import TopActorList from './TopActorList';

export default function Home(){
    return(
        <div className='content'>
            <TopFilmList />
            <TopActorList />
        </div>
    );
}

