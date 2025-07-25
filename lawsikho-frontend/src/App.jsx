import React from 'react';
import { BrowserRouter as Router ,Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Login.jsx';
import { Register } from './components/Register.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import { Home } from './components/Home.jsx';
import { Note } from './components/Note.jsx';
import { UpdateNode } from './components/UpdateNote.jsx';
import { Profile } from './components/Profile.jsx';



function App() {

  

  return (
     <>
     
    <Router>
        <Routes>
        <Route path="/register" element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/notes' element={<Note />} />
        <Route path='/node/update/:noteId' element={<UpdateNode/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user" element={<Profile />} />
        <Route path="/" element={<Home/>} />
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
       </Routes>
    </Router>
    </>
  );
}

export default App;
