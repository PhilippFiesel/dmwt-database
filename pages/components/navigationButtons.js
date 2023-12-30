import { useRef, useState, useEffect } from 'react';
import { animate, easeOut, motion } from "framer-motion";
import styles from '../../styles/Home.module.css';


const buttons = [
  {
    description: "Home",
    destination: 0
  },

  {
    description: "Information",
    destination: 525
  },

  {
    description: "Phone",
    destination: 1325
  },

  {
    description: "Questioneer",
    destination: 2150
  }
];

var scrolling = false;
var position = 0;

const Navigation = () => {
    // states for color and position of navigation indicator
    const [current, setCurrent] = useState(0);

    // navigation button clicked
    const navigateTo = (clicked) => {

      window.scrollTo({
        top: buttons[clicked].destination
      })

      scrolling = false;

      setCurrent(clicked);
    }

    useEffect(() => {
      const handleScroll = () => {
        position = window.scrollY;

          if (!scrolling) {
            if (buttons[current+1] != null && position > buttons[current+1].destination) {
              setCurrent(current => current+1);
            }
            else if (buttons[current-1] != null && position <= buttons[current-1].destination + 150) {
              setCurrent(current => current-1);
            }
          }
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    });
  

    return (
      <div className={styles.header}>
        <div style={{display: "flex", height: "100%"}}>
          {
            buttons.map((button, clicked) => (
              <motion.div
                className={styles.header_button}

                onClick={() => navigateTo(clicked)}
                animate={{
                  color: current === clicked ? "var(--primary)" : "var(--neutral-text)",
                  scale: current === clicked ? 1.075 : 1,
                  transition: {duration: 0.3}
                }}
              >
                {
                  button.description // text for button
                }
              </motion.div>
            ))
          }
        </div>
        
  
        <motion.div
          className={styles.navIndicator}
          
          style={{x: -225 - 45 - 2.5}}

          animate={{x: calculateIndicator(current)}}
          transition={{ type: "tween", duration: 0.275, ease: "easeOut" }}
        />
      </div>
    )
  }

  const calculateIndicator = (current) => {
    switch (current) {
      case 1: return -15 - 75;
      case 2: return +15 + 75;
      case 3: return +45 + 225;
    }
  }

  export default Navigation;