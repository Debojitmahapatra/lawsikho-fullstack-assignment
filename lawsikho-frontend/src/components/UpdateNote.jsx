import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const UpdateNode = () => {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('')
    const [tags, setTags] = useState([])
    const [tagInput, setTagInput] = useState('');
    const params = useParams()
    let navigate = useNavigate()

    useEffect(() => {
        getNodeById()
    }, [])


    const getNodeById = async () => {
        let result = await fetch(`http://localhost:3000/node/get/${params.noteId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        let data = await result.json()
        console.log(data)
        if (data.status == true) {
            setTitle(data.data.title)
            setContent(data.data.content)
        } else {
            alert(data.message)
            navigate('/notes')
        }
    }


    const handleUpdate = async () => {
        let updatedTags = tags;

        if (tagInput.trim()) {
            const newTag = tagInput.trim();

            if (!tags.includes(newTag)) {
                updatedTags = [...tags, newTag];
                setTags(updatedTags); // update state
            }

            setTagInput(''); // clear input
        }
        let updateData = { title, content, tags: updatedTags }
        try {
            let result = await fetch(`http://localhost:3000/node/update/${params.noteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                   
                },
                 body: JSON.stringify(updateData)
            })
            let data = await result.json()
            console.log("updated data is", data)
            if (data.status == true) {
                console.log('updated')
                navigate('/notes')
            } else {
                console.log(data.message)
            }
        } catch (error) {
            console.error('Error during update:', error);
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
        console.log(tags)
    };


    return (
        <div className="create-note">
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


            <button onClick={handleUpdate}>update Note</button>
        </div>
    )
}