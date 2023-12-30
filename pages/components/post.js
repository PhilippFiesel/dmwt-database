import React, { useState } from 'react';
import useSWR from 'swr';

const fetcher = url => fetch(url).then(res => res.json())

const ContactForm = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [firstname, setFirstName] = useState('');
    const [message, setMessage] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);

    const {
        isLoading,
        isError: error,
        mutate
    } = useSWR('/api/list-contactForm', fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    if (error) {
        return <p>Failed to fetch</p>
    }

    if (isLoading) {
        return <p>Loading Contact....</p>
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newContact = {
            email: email,
            name: name,
            firstname: firstname,
            message: message,
        };

        await fetch('/api/add-contactForm', {
            method: 'POST',
            body: JSON.stringify(newContact)
        });


        mutate();
        setEmail('');
        setName('');
        setFirstName('');
        setMessage('');
        setModalOpen(false);
    }
    return (
        <>
            <div id="open-modal-rectangle" onClick={() => setModalOpen(true)}>Open: </div>
            {isModalOpen && (
                <div id="modal-overlay">
                    <form onSubmit={handleSubmit}>
                        <label>Contact</label>
                        <div>
                            <input
                                id='email'
                                type='text'
                                placeholder='E-Mail'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                id='name'
                                type='text'
                                placeholder='Name'
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                id='firstname'
                                type='text'
                                placeholder='First Name'
                                value={firstname}
                                onChange={e => setFirstName(e.target.value)}
                            />
                        </div>
                        <div>
                            <textarea
                                id='message'
                                placeholder='Message'
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                            />
                        </div>
                        <button type='submit'>Send</button>
                    </form>
                </div>
            )}
        </>
    )
}

export default ContactForm;