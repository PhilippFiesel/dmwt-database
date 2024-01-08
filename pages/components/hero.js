import styles from "../../styles/Home.module.css";
import { MotionConfig, MotionValue, easeInOut, easeOut, motion } from "framer-motion";

const Hero = () => {
    return (
        <div className={styles.hero}>
            <motion.h1
                style={{opacity: 0, textAlign: "center"}}
                transition={{
                    duration: 0.7,
                    ease: easeOut
                }}
                animate={{
                    scale: [1.6,0.95,1],
                    opacity: [0,1],
                    y: [10,0]
                }}
            >
                Social Media
            </motion.h1>

            <motion.h2
                style={{opacity: 0, textAlign: "center"}}
                transition={{
                    duration: 0.5,
                    delay: 0.15,
                    ease: easeOut
                }}
                animate={{
                    scale: [1.6,0.95,1],
                    opacity: [0,1],
                    y: [10,0]
                }}
            >
                Your like, your responsiblity
            </motion.h2>
            
            <motion.h3
                style={{opacity: 0, textAlign: "center"}}
                transition={{
                    duration: 0.6,
                    delay: 0.175,
                    ease: easeOut
                }}
                animate={{
                    scale: [1.6,0.95,1],
                    opacity: [0,1],
                    y: [10,0]
                }}
            >
                discover the carbon impact of social media
            </motion.h3>
      </div>
    )
}

export default Hero;