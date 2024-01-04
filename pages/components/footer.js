import contactCSS from '../../styles/Contact.module.css'; 
import styles from '../../styles/Home.module.css'; 

import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

import { motion } from 'framer-motion';

const Footer = () => {
    const [formOpen, setFormOpen] = useState(false);

    useEffect(() => {
        if (formOpen) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto"
        }
    })

    return (
        <>
        {formOpen ? <BlurryBackground/> : <></>}
        <div className={styles.FooterLine}/>
        <div className={styles.FooterContainer}>

            <div 
                style={{
                    display: 'flex',
                    width: "1100px", 
                    height: '100px', 
                    alignItems: 'center',
                    position: 'relative'
                }}
            >   
                <div className={styles.FooterText}>
                    © 2023/2024 Copyright<br/>Dennis Messmer<br/>Philipp Fiesel
                </div>
                <Contact formOpen={formOpen} setFormOpen={setFormOpen} />
            </div>
        </div>
        </>
    
  );
};


const Contact = ({formOpen, setFormOpen}) => {

    return (
        <>
            {
                formOpen ?
                <Form
                    setFormOpen={setFormOpen}
                />
                :
                <ContactButton 
                    text="Contact Us"
                    onClick={() => setFormOpen(true)}
                />
            }
        </>
    )
}

const BlurryBackground = () => {
    return (
        <motion.div
            className={contactCSS.BlurryBackground}
        />
    )
}

const ContactButton = ({text, onClick}) => {
    return (
        <motion.button
            className={contactCSS.ContactButton}
            onClick={onClick}
        >
            {text}
        </motion.button>
    )
}
const Form = ({setFormOpen}) => {
    const [email, setEmail]         = useState("");
    const [lastname, setLastname]           = useState("");
    const [firstname, setFirstName] = useState("");
    const [message, setMessage]     = useState("");

    useSWR('/api/list-contactForm', {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newContact = {
            email: email,
            name: lastname,
            firstname: firstname,
            message: message
        }
    
        await fetch('../api/add-contactForm', {
            method: 'POST',
            body: JSON.stringify(newContact)
        });
        console.log(newContact, "submitted");
    }

    return (
        <motion.div className={contactCSS.Form}>

            <ExitButton setFormOpen={setFormOpen}/>

            <Heading text={"Contact"} />

            <form onSubmit={handleSubmit}>
                <TextField
                    id="1"
                    text="E-Mail"
                    value={email}
                    setText={setEmail}
                />
                <TextField
                    id="2"
                    text="First name"
                    value={firstname}
                    setText={setFirstName}
                />
                <TextField
                    id="3"
                    text="Last name"
                    value={lastname}
                    setText={setLastname}
                />
                <TextField
                    id="4"
                    text="Message"
                    value={message}
                    setText={setMessage}
                />

                <SubmitButton />
            </form>
        </motion.div>
    )
}
const Heading = ({text}) => {
    return (
        <h3 className={contactCSS.Heading}>
            {text}
        </h3>
    )
}
const SubmitButton = (values) => {
    return (
        <button 
            className={contactCSS.SubmitButton}
            type="submit"
        >
            Submit
        </button>
    )
}
const TextField = ({id, text, value, setText}) => {
    return (
        <input
            className={contactCSS.TextField}
            id={id}
            type="text"
            placeholder={text}
            value={value}
            onChange={e => setText(e.target.value)}
        />
    )
}
const ExitButton = ({setFormOpen}) => {
    return (
        <button
            className={contactCSS.ExitButton}
            onClick={() => setFormOpen(false)}
        >

        </button>
    )
}




export default Footer;