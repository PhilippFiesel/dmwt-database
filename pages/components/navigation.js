import { useRef, useState, useEffect } from 'react';
import { animate, easeOut, motion } from "framer-motion";
import styles from '../../styles/Home.module.css';

var buttons = [
  {
    description: "Home",
    destination: 0
  },

  {
    description: "Information",
    destination: 580
  },

  {
    description: "Phone",
    destination: 1299
  },

  {
    description: "Questioneer",
    destination: 2150
  }
];

var position = 0;

const Navigation = () => {
    // states for color and position of navigation indicator
    const [current, setCurrent] = useState(0);
    const [inSmallLayout, setSmallLayout] = useState();

    useEffect(() => {
      function handleResize() {
        console.log(window.innerWidth);
          if (window.innerWidth < 850) {
            setSmallLayout(true);
          }
          else {
            setSmallLayout(false);
          }
          if (window.innerWidth <= 1190) {
            buttons = [
                {
                  description: "Home",
                  destination: 0
                },
              
                {
                  description: "Information",
                  destination: 580
                },
              
                {
                  description: "Phone",
                  destination: 1868
                },
              
                {
                  description: "Questioneer",
                  destination: 2740
                }
              ];
          }
          else {
            buttons = [
              {
                description: "Home",
                destination: 0
              },
            
              {
                description: "Information",
                destination: 580
              },
            
              {
                description: "Phone",
                destination: 1299
              },
            
              {
                description: "Questioneer",
                destination: 2150
              }
            ];
          }
      }

      window.addEventListener('resize', handleResize);

      if (window.innerWidth < 850) {
        setSmallLayout(true);
      }
      if (window.innerWidth <= 1190) {
        buttons = [
            {
              description: "Home",
              destination: 0
            },
          
            {
              description: "Information",
              destination: 580
            },
          
            {
              description: "Phone",
              destination: 1868
            },
          
            {
              description: "Questioneer",
              destination: 2719
            }
          ];
      }
      else {
        buttons = [
          {
            description: "Home",
            destination: 0
          },
        
          {
            description: "Information",
            destination: 580
          },
        
          {
            description: "Phone",
            destination: 1299
          },
        
          {
            description: "Questioneer",
            destination: 2150
          }
        ];
      }
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    // navigation button clicked
    const navigateTo = (clicked) => {

      console.log(buttons[clicked].destination)
      window.scrollTo({
        top: buttons[clicked].destination,
        behavior: "smooth"
      })

      setCurrent(clicked);
    }

    useEffect(() => {
      const handleScroll = () => {
        position = window.scrollY;

        if (buttons[current+1] != null && position > buttons[current+1].destination-150) {
          setCurrent(current => current+1);
        }
        else if (buttons[current-1] != null && position <= buttons[current-1].destination + 150) {
          setCurrent(current => current-1);
        }
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    });
  

    

    return (
      <div className={styles.header}>
        <div style={{display: "flex", height: "100%", alignItems: "center", justifyContent: "center"}}>
          {
            buttons.map((button, clicked) => (
              <motion.div
                className={styles.header_button}
                key={clicked}
                onClick={() => navigateTo(clicked)}
                animate={{
                  scale: current === clicked ? 1.2 : 1,
                  transition: {duration: 0.2, ease: easeOut},
                }}
              >
                {
                inSmallLayout ?

                  <Icon icon={button.description} isActive={current == clicked} />
                :
                  <motion.span
                    style={{opacity: 0, width: 150, textAlign: "center", color: "var(--neutral-text)"}}
                    animate={{
                      opacity: [0.5,1],
                      color: current == clicked ? "var(--primary)" : "var(--neutral-text)"
                    }}
                    transition={{
                      duration: 0.4
                    }}
                  >
                    {button.description}
                  </motion.span>
                }
              </motion.div>
            ))
          }
        </div>
      </div>
    )
  }


  const Icon = ({icon, isActive}) => {
    if (icon == "Home") {
      return (
        <motion.svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
          animate={{
            opacity: [0,1],
            fill: isActive ? "var(--primary)" : "var(--neutral-text)"
          }}
          transition={{
            duration: 0.4
          }}
          style={{width: 52}}

        >
          <path d="M9.75 21.75V16.492C9.75 16.125 10.125 15.75 10.5 15.75H13.5C13.875 15.75 14.25 16.125 14.25 16.5V21.75C14.25 22.1642 14.5858 22.5 15 22.5H21C21.4142 22.5 21.75 22.1642 21.75 21.75V11.25C21.75 11.0511 21.671 10.8603 21.5303 10.7197L19.5 8.68934V3.75C19.5 3.33579 19.1642 3 18.75 3H17.25C16.8358 3 16.5 3.33579 16.5 3.75V5.68934L12.5303 1.71967C12.2374 1.42678 11.7626 1.42678 11.4697 1.71967L2.46967 10.7197C2.32902 10.8603 2.25 11.0511 2.25 11.25V21.75C2.25 22.1642 2.58579 22.5 3 22.5H9C9.41421 22.5 9.75 22.1642 9.75 21.75Z"/>
        </motion.svg>
      )
    }
    else if (icon == "Information") {
      return (
        <motion.svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
          animate={{
            opacity: [0,1],
            fill: isActive ? "var(--primary)" : "var(--neutral-text)"
          }}
          transition={{
            duration: 0.4
          }}
          style={{width: 52}}
        >
          <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM13.3961 9.88184L11.8931 16.9395C11.7877 17.4492 11.9371 17.7393 12.3502 17.7393C12.6402 17.7393 13.0796 17.6338 13.3785 17.3701L13.2466 17.9941C12.816 18.5127 11.8668 18.8906 11.0494 18.8906C9.99469 18.8906 9.54645 18.2578 9.83648 16.9131L10.9439 11.71C11.0406 11.2705 10.9527 11.1123 10.5132 11.0068L9.83648 10.8838L9.95953 10.3125L13.3961 9.88184ZM12 8.25C11.1716 8.25 10.5 7.57843 10.5 6.75C10.5 5.92157 11.1716 5.25 12 5.25C12.8284 5.25 13.5 5.92157 13.5 6.75C13.5 7.57843 12.8284 8.25 12 8.25Z"/>
        </motion.svg>
      )
    }
    else if (icon == "Phone") {
      return (
        <motion.svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
          animate={{
            opacity: [0,1],
            fill: isActive ? "var(--primary)" : "var(--neutral-text)"
          }}
          transition={{
            duration: 0.4
          }}
          style={{width: 52}}
        >
          <path d="M4.5 3C4.5 1.34315 5.84315 0 7.5 0H16.5C18.1569 0 19.5 1.34315 19.5 3V21C19.5 22.6569 18.1569 24 16.5 24H7.5C5.84315 24 4.5 22.6569 4.5 21V3ZM13.5 19.5C13.5 18.6716 12.8284 18 12 18C11.1716 18 10.5 18.6716 10.5 19.5C10.5 20.3284 11.1716 21 12 21C12.8284 21 13.5 20.3284 13.5 19.5Z"/>
        </motion.svg>
      )
    }
    else if (icon == "Questioneer") {
      return (
        <motion.svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
          animate={{
            opacity: [0,1],
            fill: isActive ? "var(--primary)" : "var(--neutral-text)"
          }}
          transition={{
            duration: 0.4
          }}
          style={{width: 52}}
        >
          <path d="M10.5 3.75C10.5 3.33579 10.8358 3 11.25 3H21.75C22.1642 3 22.5 3.33579 22.5 3.75V5.25C22.5 5.66421 22.1642 6 21.75 6H11.25C10.8358 6 10.5 5.66421 10.5 5.25V3.75Z"/>
          <path d="M3 1.5C1.34315 1.5 0 2.84315 0 4.5V7.5C0 9.15685 1.34315 10.5 3 10.5H6C7.65685 10.5 9 9.15685 9 7.5V4.5C9 2.84315 7.65685 1.5 6 1.5H3ZM3 13.5C1.34315 13.5 0 14.8431 0 16.5V19.5C0 21.1569 1.34315 22.5 3 22.5H6C7.65685 22.5 9 21.1569 9 19.5V16.5C9 14.8431 7.65685 13.5 6 13.5H3ZM4.28033 8.03033C3.98744 8.32322 3.51256 8.32322 3.21967 8.03033L1.71967 6.53033C1.42678 6.23744 1.42678 5.76256 1.71967 5.46967C2.01256 5.17678 2.48744 5.17678 2.78033 5.46967L3.75 6.43934L6.21967 3.96967C6.51256 3.67678 6.98744 3.67678 7.28033 3.96967C7.57322 4.26256 7.57322 4.73744 7.28033 5.03033L4.28033 8.03033ZM4.28033 20.0303C3.98744 20.3232 3.51256 20.3232 3.21967 20.0303L1.71967 18.5303C1.42678 18.2374 1.42678 17.7626 1.71967 17.4697C2.01256 17.1768 2.48744 17.1768 2.78033 17.4697L3.75 18.4393L6.21967 15.9697C6.51256 15.6768 6.98744 15.6768 7.28033 15.9697C7.57322 16.2626 7.57322 16.7374 7.28033 17.0303L4.28033 20.0303Z" />
          <path d="M10.5 15.75C10.5 15.3358 10.8358 15 11.25 15H21.75C22.1642 15 22.5 15.3358 22.5 15.75V17.25C22.5 17.6642 22.1642 18 21.75 18H11.25C10.8358 18 10.5 17.6642 10.5 17.25V15.75Z"/>
          <path d="M10.5 8.25C10.5 7.83579 10.8358 7.5 11.25 7.5H18.75C19.1642 7.5 19.5 7.83579 19.5 8.25C19.5 8.66421 19.1642 9 18.75 9H11.25C10.8358 9 10.5 8.66421 10.5 8.25Z"/>
          <path d="M10.5 20.25C10.5 19.8358 10.8358 19.5 11.25 19.5H18.75C19.1642 19.5 19.5 19.8358 19.5 20.25C19.5 20.6642 19.1642 21 18.75 21H11.25C10.8358 21 10.5 20.6642 10.5 20.25Z"/>
        </motion.svg>    
      )  
    }
  }

  export default Navigation;