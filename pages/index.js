import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {easeInOut, easeOut, motion} from "framer-motion";

import Navigation from "./components/navigation";
import ContactForm from "./components/contactform";
import Info from "./components/info";
import Phone from "./components/phone";
import Questioneer from "./components/questioneer";
import Hero from "./components/hero"



export default function Home() {
  return (
    <>
  

      <Hero />
      <Info />
      <Phone />
      <Questioneer />
      <ContactForm />
      
      <Navigation />
    </>
  );
}
