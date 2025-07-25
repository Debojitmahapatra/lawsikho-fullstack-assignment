import { useState } from "react"
import { isTokenValid } from "../auth/Auth";
import { useEffect } from "react";
import './Note.css'
import { useNavigate } from "react-router-dom";
import { FaShareSquare } from "react-icons/fa";


export const Note = () => {
    const [notes, setNotes] = useState([])
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('')
    const [tags, setTags] = useState([])
    const [userId, setUserId] = useState('')
    const [shareNote, setShareNote] = useState([])
    const [shareInputs, setShareInputs] = useState({});
    let navigate = useNavigate()

    const [tagInput, setTagInput] = useState('');
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('token'))
        const id = JSON.parse(localStorage.getItem('data'))._id
        if (data) {
            let isValid = isTokenValid(data)
            if (!isValid) navigate('/')

            setUserId(id)
            getNode()
            getShareNote()
        }

    }, [userId, tags]);
    const getShareNote = async () => {
        let result = await fetch('http://localhost:3000/node/share_nodes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        let data = await result.json()
        console.log(data)
        if (data.status == true) {
            setShareNote(data.data)
        } else {
            alert(data.message)
        }
    }
    const getNode = async () => {
        let result = await fetch('http://localhost:3000/node/get', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        let data = await result.json()

        if (data.success == true) {
            setNotes(data.data)
        } else {
            alert(data.message)
        }
    }
    const createNote = async () => {

        let updatedTags = tags;

        if (tagInput.trim()) {
            const newTag = tagInput.trim();

            if (!tags.includes(newTag)) {
                updatedTags = [...tags, newTag];
                setTags(updatedTags); // update state
            }

            setTagInput(''); // clear input
        }
        let result = await fetch('http://localhost:3000/node/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            },

            //'Authorization', 'Bearer Token'
            body: JSON.stringify({ title, content, tags: updatedTags })
        });
        result = await result.json()

        if (result.success === true) {
            alert("Successful")
            setTitle('')
            setContent('')
            setTags([])
            setTagInput('')
            getNode()
        }
        else {
            alert(result.message)
        }
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = tagInput.trim();

            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
                setTagInput('');
            }
        }

    };
    const handleDelete = async (noteId) => {

        let result = await fetch(`http://localhost:3000/node/delete/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        let data = await result.json()
        if (data.status == true) {
            console.log('deleted')
            getNode()
        } else {
            console.log(data.message)
        }
    }
    const handleShare = async (noteId, shareValue) => {
        console.log(noteId)
        console.log(shareValue)
        let result = await fetch(`http://localhost:3000/node/share/${noteId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            },

            //'Authorization', 'Bearer Token'
            body: JSON.stringify({ name: shareValue })
        });
        result = await result.json()

        if (result.status === true) {
            console.log("Successful")
            setShareInputs({})
        }
        else {
            alert(result.message)
        }
    }
    const searchHandle = async (e) => {
        let key = e.target.value;

        if (key) {
            let result = await fetch(`http://localhost:3000/search_nods/${key}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                },
            });
            result = await result.json();
            console.log(result);
            
            if (result) {
                setNotes(result);
            }
        } else {
            getNode()
        }
    };

    return (
        <section className="main-section">
            <div className="searchbox-title-content">
                <input className="searchbox" type="text" placeholder="Search note by title content or tags" onChange={searchHandle} />
            </div>

            <div className="note-list"> {notes ? notes.map(note => (
                <div className="note" key={note._id}>
                    <h3><b>Title:</b>  {note.title}</h3>
                    <p><b>content:</b> {note.content}</p>
                    <h5>{note.tags.map((data) => "#" + data + " ")}</h5>
                    <div className="note-actions">
                        <button className="btn btn-update" onClick={() => navigate(`/node/update/${note._id}`)}>Update</button>
                        <button className="btn btn-delete" onClick={() => handleDelete(note._id)}>Delete</button>
                        <input className="share-input" placeholder="Share" value={shareInputs[note._id] || ''}
                            onChange={(e) =>
                                setShareInputs({ ...shareInputs, [note._id]: e.target.value })
                            }
                        />

                        <button className="btn btn-share" onClick={() => handleShare(note._id, shareInputs[note._id])} > <FaShareSquare /> </button>

                    </div>
                </div>
            )) : <h2> No result found </h2>}</div>
            <div className="create-note">
                <h2 style={{ fontWeight: 600, marginBottom: '1rem' }}>Create New Note</h2>

                <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                <input
                    type="text"
                    placeholder="Enter one tag at a time (press Enter)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="p-2 border border-gray-300 rounded"
                />

                <button onClick={createNote}>Create Note</button>
                <button style={{ fontWeight: 600, marginBottom: '1rem' }} onClick={() => navigate('/')}>back to home</button>
            </div>
            <div className="share-notes">{shareNote.map(note => (
                <div className="note" key={note._id}>
                    <h2><b>From:</b>  {note.fromUser.name}</h2>
                    <h3><b>Title:</b>  {note.noteId.title}</h3>
                    <p><b>content:</b> {note.noteId.content}</p>
                    <h5>tags: {note.noteId.tags.map((data) => data + " ")}</h5>
                    <h4><b>Permission:</b> {note.permission}</h4>
                </div>
            ))} </div>

        </section>
    )
}