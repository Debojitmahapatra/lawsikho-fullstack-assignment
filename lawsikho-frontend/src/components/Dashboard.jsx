import React, { useEffect, useState } from 'react';
import { FaUserLarge } from 'react-icons/fa6';
import { isTokenValid } from '../auth/Auth';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'
import LogoutButton from './LogoutButton';
export const Dashboard=()=> {
   
   const [notes, setNotes] = useState([])
   const [name, setName]=useState('')
   const [email,setEmail]=useState('')
   const [activeUser,setActiveUser]=useState([])
   const [mostTags,setMostTags]=useState([])
let navigate = useNavigate()
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'))
        const woner = JSON.parse(localStorage.getItem('woner'))
        const data=JSON.parse(localStorage.getItem('data'))
        if (token) {
            let isValid = isTokenValid(token)
            if (!isValid) navigate('/')
            setName(woner)
            setEmail(data.email)
            getUsers()
            getActiveUser()
            getMostUseableTags()
        }
        

    }, [name,email]);
    const getMostUseableTags = async () => {
        let result = await fetch('http://localhost:3000/most_useable_tags', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let data = await result.json()
        console.log(data.data)
        if (data.status == true) {
            setMostTags(data.data)
        } else {
            alert(data.message)
        }
    }
 const getActiveUser = async () => {
        let result = await fetch('http://localhost:3000/most_active', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let data = await result.json()
        console.log(data.data)
        if (data.status == true) {
            setActiveUser(data.data)
        } else {
            alert(data.message)
        }
    }
    const getUsers = async () => {
        let result = await fetch('http://localhost:3000/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let data = await result.json()
        console.log(data.data)
        if (data.success == true) {
            setNotes(data.data)
        } else {
            alert(data.message)
        }
    }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className='info-div'>
        <div className='user-info'>
          <h2><b>UserName: </b> {name}</h2>
          <h2><b>Email Id:</b> {email}</h2>
        </div>
        <div className='logo-logout'>
          <div className="user-logo"><FaUserLarge className="logo-user"/></div>
          <h2 className='btn logout'><LogoutButton/></h2>
            <button className='btn home-btn' onClick={() => navigate('/')}>Home</button>
          
        </div>

      </div>
      <div className='all-information'>
        <div className='active-user-list'>
         <div className='heading active-heading'> <h2>active users</h2></div>
          <div className='user-lists lists-dashboard'>{activeUser.map(note => (
             <div className="note" key={note._id}>
              <h3><b>user: </b>  {note.name}</h3>
             </div>
          ))}</div>
        </div>
        <div className='total-user-list'>
          <div className='heading total-heading'> <h2>total users</h2></div>
          <div className='total-lists lists-dashboard'>{notes.map(note => (
             <div className="note" key={note._id}>
              <h3><b>user: </b>  {note.name}</h3>
             </div>
          ))}</div>
        </div>
        <div className='most-tags-list'>
           <div className='heading total-heading'> <h2>Active Tags</h2></div>
          <div className='tags-lists lists-dashboard'>{mostTags.map(note => (
             <div className="note" key={note._id}>
              <h3><b>tags: </b>  {note.tagName}  <span >{note.tagCount}</span></h3>
             </div>
          ))}</div>
        </div>
      </div>
      
    </div>
  );
}
