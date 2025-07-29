import { Link, useNavigate } from 'react-router-dom';

import { FaUserLarge } from "react-icons/fa6";
import './Home.css'
import { useState, useEffect } from 'react';
import { isTokenValid } from '../auth/Auth.jsx';




export const Home = () => {

    const [change, setChange] = useState(false)
    const [userName, setUserName] = useState('')
    const [role,setRole]=useState('')
    let navigate = useNavigate()
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'))
        const woner = JSON.parse(localStorage.getItem('woner'))
        const getRole=JSON.parse(localStorage.getItem('data'))
        if (token && woner) {
            let isValid = isTokenValid(token)
            if (isValid) {
                setChange(true)
                setUserName(woner)
                setRole(JSON.parse(localStorage.getItem('data')).role)
            }
             else  localStorage.clear();
        }
    }, [change, userName, role]);

    const handleLogin = () => {
        navigate('/login')
    }


    return (
        <>
            <section className="main-section">
                <div className="user-information intomain">
                    <div className="user-logo"><FaUserLarge className="logo" /></div>
                    <div><h1>{change ? userName : <button className='log-btn' onClick={handleLogin}>login</button>}</h1></div>
                   
                </div>
                <div className="home-menu intomain">
                    <ul className='menu-ul'>
                        <Link to="/notes"> <li>Notes</li></Link>
                        <Link to="/user"><li>User</li></Link>
                        <Link to="/"><li>Role: {role}</li></Link>
                        <Link to="/dashboard"><li>Dashboard</li></Link>

                    </ul>
                </div>
            </section>
        </>
    )
}


