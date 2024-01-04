import contactCSS from '../../styles/Contact.module.css'; 
import styles from '../../styles/Home.module.css'; 

import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

import { delay, easeIn, easeInOut, easeOut, motion } from 'framer-motion';

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
        {formOpen ? <BlurryBackground setFormOpen={setFormOpen}/> : <></>}
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
                    © 2023/2024 Copyright<br/>Dennis Messmer<br/>Philipp Fiesel<br/>Icons: Bootstrap Icons
                </div>
                <Contact formOpen={formOpen} setFormOpen={setFormOpen} />
            </div>
        </div>
        </>
    
  );
};
const BlurryBackground = ({setFormOpen}) => {
    return (
        <motion.div
            className={contactCSS.BlurryBackground}
            onClick={() => setFormOpen(false)}
            animate={{opacity:[0,1]}}
            transition={{duration: 0.15}}
        />
    )
}


const Contact = ({formOpen, setFormOpen}) => {
    const [menu, toggleMenu] = useState(false);



    return (
        <>
            {
                formOpen ?
                <Form
                    setFormOpen={setFormOpen}
                />
                :
                <>
                
                    <EmailButton menuState={menu} />
                    <FormButton menuState={menu} setFormOpen={setFormOpen}/>
                    
                    <ContactButton
                        text="Contact"
                        onClick={() => toggleMenu(!menu)}
                        menuState={menu}
                    />
                </>
            }
        </>
    )
}







const EmailButton = ({menuState}) => {
    return (
        <motion.button 
            className={contactCSS.MenuButton}
            animate={menuState ? {x: -118}:{}}
            transition={{
                duration: 0.4,
                delay: 0.075,
                ease: easeOut
            }}

            onClick={() => window.location.href = `mailto:${"dennis.messmer@student.reutlingen-university.de,philipp.fiesel@student.reutlingen-university.de"}`}
        >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.0557836 3.99987C0.283196 2.99794 1.17925 2.25 2.25 2.25H15.75C16.8207 2.25 17.7168 2.99794 17.9442 3.99987L9 9.46578L0.0557836 3.99987ZM0 5.28422V13.2757L6.52859 9.27392L0 5.28422ZM7.60658 9.93268L0.215855 14.4629C0.57668 15.2238 1.35189 15.75 2.25 15.75H15.75C16.6481 15.75 17.4233 15.2238 17.7841 14.4629L10.3934 9.93268L9 10.7842L7.60658 9.93268ZM11.4714 9.27392L18 13.2757V5.28422L11.4714 9.27392Z" fill="white"/>
            </svg>
        </motion.button>
    )
}
const FormButton = ({menuState,setFormOpen}) => {
    return (
        <motion.button
            animate={menuState ? {x: -59}:{}}
            className={contactCSS.MenuButton}
            onClick={() => setFormOpen(true)}
            transition={{
                delay: 0.075,
                duration: 0.4,
                ease: easeOut
            }}
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2C16 0.895431 15.1046 0 14 0H2C0.895431 0 0 0.895431 0 2V10C0 11.1046 0.895431 12 2 12H11.5858C11.851 12 12.1054 12.1054 12.2929 12.2929L15.1464 15.1464C15.4614 15.4614 16 15.2383 16 14.7929V2ZM3.5 3H12.5C12.7761 3 13 3.22386 13 3.5C13 3.77614 12.7761 4 12.5 4H3.5C3.22386 4 3 3.77614 3 3.5C3 3.22386 3.22386 3 3.5 3ZM3.5 5.5H12.5C12.7761 5.5 13 5.72386 13 6C13 6.27614 12.7761 6.5 12.5 6.5H3.5C3.22386 6.5 3 6.27614 3 6C3 5.72386 3.22386 5.5 3.5 5.5ZM3.5 8H8.5C8.77614 8 9 8.22386 9 8.5C9 8.77614 8.77614 9 8.5 9H3.5C3.22386 9 3 8.77614 3 8.5C3 8.22386 3.22386 8 3.5 8Z" fill="white"/>
            </svg>
        </motion.button>
    )
}
const ContactButton = ({text, onClick, menuState}) => {
    

    return (
        <motion.button
            className={contactCSS.ContactButton}
            onClick={onClick}
            animate={{
                width: menuState ? [160,44,44,44] : "",
                x: menuState ? [0,5,0,0] : "",
                transition: {
                    duration: menuState ? 0.8 : 0.4,
                    ease: menuState ? easeOut : easeInOut
                }
            }}
            
        >
            {
                menuState ? 
                <ArrowRight menuState={menuState}/>
                :
                <motion.div
                    animate={{opacity:[0,1]}}
                    transition={{duration: 0.3}}
                >
                    {text}
                </motion.div>
            }

        </motion.button>
    )
}
const Form = ({setFormOpen}) => {
    const [email, setEmail]         = useState("");
    const [lastname, setLastname]           = useState("");
    const [firstname, setFirstName] = useState("");
    const [message, setMessage]     = useState("");

    useSWR('../api/contactForm', {
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
    
        await fetch('../api/contactForm', {
            method: 'POST',
            body: JSON.stringify(newContact)
        });
        console.log(newContact, "submitted");
    }

    return (
        <motion.div 
            className={contactCSS.Form}
            animate={{opacity:[0,1]}}
            transition={{duration: 0.3}}
        >

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
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.11612 1.11612C1.60427 0.627961 2.39573 0.627961 2.88388 1.11612L9.5 7.73223L16.1161 1.11612C16.6043 0.627961 17.3957 0.627961 17.8839 1.11612C18.372 1.60427 18.372 2.39573 17.8839 2.88388L11.2678 9.5L17.8839 16.1161C18.372 16.6043 18.372 17.3957 17.8839 17.8839C17.3957 18.372 16.6043 18.372 16.1161 17.8839L9.5 11.2678L2.88388 17.8839C2.39573 18.372 1.60427 18.372 1.11612 17.8839C0.627961 17.3957 0.627961 16.6043 1.11612 16.1161L7.73223 9.5L1.11612 2.88388C0.627961 2.39573 0.627961 1.60427 1.11612 1.11612Z" fill="white"/>
            </svg>

        </button>
    )
}
const ArrowRight = ({menuState}) => {

        return (
            <motion.svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" animate={{opacity:[0,1]}}
            transition={{duration: 0.3}}>
                <path fillRule="evenodd" clipRule="evenodd" d="M11 22C11 21.2406 11.6156 20.625 12.375 20.625H28.3055L22.4027 14.7223C21.8658 14.1853 21.8658 13.3147 22.4027 12.7777C22.9397 12.2408 23.8103 12.2408 24.3473 12.7777L32.5973 21.0277C33.1342 21.5647 33.1342 22.4353 32.5973 22.9723L24.3473 31.2223C23.8103 31.7592 22.9397 31.7592 22.4027 31.2223C21.8658 30.6853 21.8658 29.8147 22.4027 29.2777L28.3055 23.375H12.375C11.6156 23.375 11 22.7594 11 22Z" fill="white"/>
            </motion.svg>
        )
}
export default Footer;