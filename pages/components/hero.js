import styles from "../../styles/Home.module.css";
import { MotionConfig, MotionValue, easeInOut, easeOut, motion } from "framer-motion";

const Hero = () => {
    return (
        <div className={styles.hero}>
        <MotionConfig
            animate={{
                scale: [1.6,0.95,1],
                opacity: [0,1],
                y: [10,0]
            }}
            transition={{
                ease: easeOut
            }}
        >

            <motion.h1
                style={{opacity: 0, textAlign: "center"}}
                transition={{
                    duration: 0.7,
                }}
            >
                Social Media
            </motion.h1>

            <motion.h2
                style={{opacity: 0, textAlign: "center"}}
                transition={{
                    duration: 0.5,
                    delay: 0.15
                }}
            >
                Your click, your responsiblity
            </motion.h2>
            
            <motion.h3
                style={{opacity: 0, textAlign: "center"}}
                transition={{
                    duration: 0.6,
                    delay: 0.175
                }}
            >
                discover the carbon impact of social media
            </motion.h3>

      </MotionConfig>
      </div>
    )
}

export default Hero;