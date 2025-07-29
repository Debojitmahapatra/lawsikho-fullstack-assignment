import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenValid } from '../auth/Auth.jsx';
import { useEffect } from 'react';
import './Login.Css'
export const Register=()=>{
  const [name, setName] = useState('');
  const [email,setEmail]=useState('')
  const [password, setPassword] = useState('');
  const [phone,setPhone]=useState('')
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
    e.preventDefault();
    const res = await fetch('http://localhost:3000/user/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name,email,password,phone})
    });
    const data = await res.json();
    console.log(data)
    if (data.success==true) {
      navigate('/login');
    }else{
        alert(data.message)
    }
  };
  const handleLogin=()=>{
      navigate('/login');
  }
  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Register</h2>
      <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <input placeholder="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      <button type="submit">Register</button>
       <button onClick={handleLogin}>login</button>
    </form>
  );
}


