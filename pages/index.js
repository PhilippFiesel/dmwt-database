import Head from 'next/head';
import styles from '../styles/Home.module.css';

import Navigation from "./components/navigation";

import { useRef } from 'react';

import Info from "./components/info";
import Phone from "./components/phone";
import Questioneer from "./components/questioneer";
import Hero from "./components/hero";
import Footer from "./components/footer"



export default function Home() {
  return (
    <>
      <Hero />
      <Info />
      <Phone />
      <Questioneer />
      
      <Navigation/>
      <Footer />
    </>
  );
}
