import React, { useState } from 'react'
import {Main} from './components/Main'
import Login from './components/Login'



const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const toggleLogin = () => setLoggedIn(!loggedIn)
    const [guest, setGuest] = useState(false);
    const toggleGuest = () => setGuest(!guest)

    return (
        <>
            {loggedIn || guest ? null
                : <Login
                    toggleLogin={toggleLogin}
                    toggleGuest={toggleGuest}
                />}
            <Main 
                toggleGuest={toggleGuest}
                guest={guest}
                loggedIn={loggedIn}
            />
        </>
    )
}



export default App