import { FaUserLarge } from "react-icons/fa6"
import { useNavigate } from "react-router-dom"
import { isTokenValid } from "../auth/Auth"
import LogoutButton from "./LogoutButton"
import { useEffect, useState } from "react"
import './Profile.css'
export const Profile=()=>{
       const [name, setName]=useState('')
       const [email,setEmail]=useState('')
       const [phone,setPhone]=useState('')
        const navigate=useNavigate()
         useEffect(() => {
             const token = JSON.parse(localStorage.getItem('token'))
             const woner = JSON.parse(localStorage.getItem('woner'))
             const data=JSON.parse(localStorage.getItem('data'))
             if (token) {
                 let isValid = isTokenValid(token)
                 if (!isValid){ 
                localStorage.clear();
                    navigate('/')}
                 setName(woner)
                 setEmail(data.email)
                 setPhone(data.phone)
                
             }else{
            alert('login to go user page')
             navigate('/')
        }
             
     
         }, [name,email,phone]);

    return (
        
        <div className="user-Profile">
             <div className="user-logo"><FaUserLarge className="logo-user"/></div>
         <div className="user-info">  <div className="user-name"> <h2><b>UserName: </b> {name}</h2></div>
            <div className="user-email"><h2><b>Email Id:</b> {email}</h2></div>
            <div className="user-number"><h2><b>Mobile No:</b> {phone}</h2></div>
       </div>  
       <div className="logOut"><LogoutButton/></div>
       <button className='btn home-btn' onClick={() => navigate('/')}>Home</button>
        </div>
    )


    
}

