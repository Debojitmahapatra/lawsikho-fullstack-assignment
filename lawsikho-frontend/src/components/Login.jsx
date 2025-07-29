import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenValid } from '../auth/Auth.jsx';
import { useEffect } from 'react';
import './Login.css'
export const Login=()=>{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

       useEffect(()=>{
        const data = JSON.parse(localStorage.getItem('token'))
        if(data){
           let isValid= isTokenValid(data)
           if(isValid) navigate('/')
            else  localStorage.clear();
        }
         
    });
  const handleSubmit = async (e) => {
    console.log(email, password);
    
    e.preventDefault();
    const res = await fetch('http://localhost:3000/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
       let result=await res.json()
       
         console.warn(result)
      
    
        if(result.status==true ){
            console.log(result.data);
        localStorage.setItem("woner",JSON.stringify(result.data.user.name))
        localStorage.setItem("data",JSON.stringify(result.data.user))
        localStorage.setItem("token",JSON.stringify(result.data.token))
        navigate('/')
        }else{
            alert(result.message)
        }
   
  };

  const handleSignup=()=>{
    navigate('/register')
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login</h2>
       <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
      

      <button onClick={handleSignup}>signup</button>
      <br />
      <button className='btn home-btn' onClick={() => navigate('/')}>Home</button>
    </form>
  );
}

