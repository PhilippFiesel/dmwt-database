import styles from '../../styles/Home.module.css';
import { motion, useScroll, useMotionValue, useTransform } from "framer-motion";
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const Info = () => {
    const ref = useRef(null);

    const [playAnimation, setPlayAnimation] = useState(false);


    useEffect(() => {
        const handleScroll = () => {
            // Hier definieren, bei welchem Scroll-Y-Wert du die Animation auslösen möchtest
            const scrollTriggerPoint = 500; // Beispiel: Trigger-Point bei 500px

            // Überprüfe, ob der aktuelle Scroll-Wert den Trigger-Point erreicht hat
            if (window.scrollY > scrollTriggerPoint) {
                // Führe hier deine Framer-Animation aus
                // Zum Beispiel: starte die Animation oder setze einen State, der die Animation auslöst
                setPlayAnimation(true);
            }
            else {
                setPlayAnimation(false);
            }
        };

        // Füge einen Event-Listener hinzu, um den Scroll-Status zu überwachen
        window.addEventListener('scroll', handleScroll);

        // Clean-up-Funktion, um den Event-Listener zu entfernen, wenn das Komponenten unmountet wird
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
        <motion.div className={styles.info_container} 
        >
            <motion.div className={styles.info_box}
                whileHover={{scale: 1.025}}
                transition={{duration: 0.3}}
            >

            <motion.h4 style={{
                    marginBottom: "60px",
                    marginTop: "50px",
                    position: "relative",
                    left: "40px",
                    width: "450px"
                }}
            >
                    Social Media produces
                    <span style={{color: "var(--neutral-text)"}}> CO
                    <span style={{fontSize: "16px", color: "var(--neutral-text)"}}>2</span></span>
            </motion.h4>


            <h3 style={{
                    color: "var(--neutral-text)",
                    fontWeight: "400",
                    position: "relative",
                    left: "40px",
                    width: "480px",
                    marginBottom: "35px"
                }}>
                The use of social media 
                platforms contributes to emissions due to the 
                <span style={{color: "var(--white-text)"}}>  energy consumption </span>
                of data centers and servers
            </h3>


            <h3 style={{
                    color: "var(--neutral-text)",
                    fontWeight: "400",
                    position: "relative",
                    left: "40px",
                    width: "480px",
                    marginBottom: "27px"
                }}>
                Using <span style={{color: "var(--primary)"}}>Social Media for 8 minutes </span> produces almost
                equally as much <span style={{color: "var(--white-text)"}}>CO<span style={{fontSize: "12px"}}>2</span> </span>as driving a <span  style={{color: "var(--primary)"}}>car for a minute </span>
            </h3>
            </motion.div>


            <motion.div className={styles.info_box}
                whileHover={{scale: 1.025}}
                transition={{duration: 0.3}}
            >
            <h4
            style={{
                marginBottom: "60px",
                marginTop: "50px",
                position: "relative",
                left: "40px",
                width: "450px"
            }}><span style={{color: "var(--neutral-text)"}}>CO<span style={{fontSize: "16px",color: "var(--neutral-text)"}}>2</span></span> per minute</h4>

            <div style={{marginBottom: "67px", display: "flex"}}>
            <img style={
                {
                marginLeft: "40px",
                marginRight: "40px",
                position: "relative",

                }} src='car-front-fill.svg' />
                <div>
                <h4>
                    <span style={{color: "var(--primary)"}}>10 g </span>
                    <span style={{color: "var(--neutral-text)", fontSize: "24px"}}>CO
                    <span style={{color: "var(--neutral-text)", fontSize: "12px"}}>2</span>/min</span>
                </h4>
                <h3 style={{color: "var(--neutral-text)"}}>
                    emission for the average <span style={{color: "var(--white-text)"}}>diesel motor</span>
                </h3>
                </div>
                
            </div>

            
            <div style={{display: "flex"}}>
                <img style={
                {
                marginLeft: "40px",
                marginRight: "40px",
                position: "relative"

                }} src='phone-fill.svg' />


                <div>
                <h4>
                    <span style={{color: "var(--primary)"}}>1.14 g </span>
                    <span style={{color: "var(--neutral-text)", fontSize: "24px"}}>CO
                    <span style={{color: "var(--neutral-text)", fontSize: "12px"}}>2</span>/min</span>
                </h4>
                <h3 style={{color: "var(--neutral-text)"}}>
                    emission for the average <span style={{color: "var(--white-text)"}}>social media app</span>
                </h3>
                </div>
                
            </div>

            
            </motion.div>
      </motion.div>
    )
}

export default Info;