import React, { useState } from 'react';
import useSWR from 'swr';

const fetcher = url => fetch(url).then(res => res.json())

const Post = () => {
    const [name, setName] = useState('')
    const [owner, setOwner] = useState('')
    const {
        data: pets,
        isLoading,
        isError: error
    } = useSWR('/api/list-pets', fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })

    if (error) {
        return <p>Failed to fetch</p>
    }

    if (isLoading) {
        return <p>Loading pets....</p>
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newPet = {
            petName: name,
            ownerName: owner
        }

        const response = await fetch('/api/add-pet', {
            method: 'POST',
            body: JSON.stringify(newPet)
        })

        const data = await response.json()
        console.log(JSON.stringify(data))
    }
    

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='name'>Name</label>
                    <input
                        id='name'
                        type='text'
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='owner'>Owner</label>
                    <input
                        id='owner'
                        type='text'
                        value={owner}
                        onChange={e => setOwner(e.target.value)}
                    />
                </div>
                <button type='submit'>Submit</button>
            </form>
            <ul>
                {pets.map((pet, index) => (
                    <li key={index}>
                        {pet.name} {pet.owner}
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Post
