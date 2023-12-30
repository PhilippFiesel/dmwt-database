import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {easeInOut, easeOut, motion} from "framer-motion";

import Navigation from './components/navigationButtons.js';
import Info from './components/info.js';
import Phone from './components/phone.js';
import ContactForm from './components/post.js';
import Questioneer from './components/questioneer';

export default function Home() {
  return (
    <>
      <div className={styles.hero}>

        <motion.h1
          initial={{
            scale: 1.1,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 0.7,
            ease: easeInOut
          }}
        >
          Social Media
        </motion.h1>

        <motion.h2
          initial={{
            scale: 1.1,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          transition={{
            duration: 0.5,
            ease: easeInOut,
            delay: 0.15
          }}
        >
          Your click, your responsiblity
        </motion.h2>
        
        <motion.h3
          initial={{
            scale: 1.1,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          transition={{
            duration: 0.6,
            ease: easeInOut,
            delay: 0.175
          }}
        >
          discover the carbon impact of social media
        </motion.h3>

      </div>

      <Info />
      <Phone />
      <Questioneer />
      <ContactForm />
      
      <Navigation />
    </>
  );
}
