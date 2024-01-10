import styles from '../../styles/Home.module.css';
import useSWR from 'swr';
import { useRef, useState, useEffect } from 'react';
import {animate, easeOut, motion} from "framer-motion";
import phoneCSS from "../../styles/Phone.module.css"

function maxValue(arr) {
    let max = arr[0].value;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i].value > max) {
            max = arr[i].value;
        }
    }
    return max;
}


const Phone = () => {

    // fetching data from json
    const {data,error} = useSWR("data/stats.json", (url) => fetch(url).then((res) => res.json()));

    const [prevPage, setPrevPage] = useState(0);
    const [page, setPage] = useState(0);
    const [fadeOutAnimation, setFadeOutAnimation] = useState(false);
    const [power, setPower] = useState(false);

    if (!data) return <div>NULL</div>;

    // stats from json
    const stats = data.stats;
    const currentPage = stats[page];


    const switchPage = (clickedButton) => {
        const defaultPage = 0;
        const onDefaultPage = clickedButton == defaultPage;
        const clickOnActiveButton = clickedButton == page;

        setPrevPage(page);

        if (clickOnActiveButton) {
            setPage(defaultPage);
        }
        else {
            setPage(clickedButton);
        }
        setFadeOutAnimation(true);
    }

    return (
        <Container>
            <PhoneBox>

                <PowerButton
                    power={power}
                    setPower={setPower}
                />

        { power ?
            <>
                <ReturnButton
                    stats={stats}
                    page={page}
                    setPage={() => switchPage(0)}
                    fadeOutAnimation={fadeOutAnimation}
                />
                <Heading 
                    title={currentPage.title}
                    fadeOutAnimation={fadeOutAnimation}
                    page={currentPage}
                />
                <BarChart 
                    page={currentPage}
                    setFadeOutAnimation={setFadeOutAnimation}
                    fadeOutAnimation={fadeOutAnimation}
                />

                <Description
                    text={currentPage.text}
                    fadeOutAnimation={fadeOutAnimation}
                />
                
                <MenuBar>
                    <Button
                        onClick={() => switchPage(1)}
                        page={page}
                        id={1}
                        icon={<InstagramIcon  active={page == 1}/>}
                    />

                    <Button
                        onClick={() => switchPage(2)}
                        page={page}
                        id={2}
                        icon={<PinterestIcon active={page == 2}/>}
                    />

                    <Button
                        onClick={() => switchPage(3)}
                        page={page}
                        id={3}
                        icon={<RedditIcon active={page == 3}/>}
                    />

                    <Button
                        onClick={() => switchPage(4)}
                        page={page}
                        id={4}
                        icon={<TikTokIcon active={page == 4}/>}
                    />
                </MenuBar>
            </>
            :
            ""
        }
        
            </PhoneBox>
        </Container>
    )
}

const Container = ({children}) => {
    return (
        <div className={styles.phone_container}>
            {children}
        </div>
    )
}
const PowerButton = ({power, setPower}) => {

    const [hovering, setHovering] = useState(false);
    const [removed, setRemove] = useState(false);

        console.log(removed);
    
    const clickedAnimation = {
        backgroundColor: "var(--primary)",
        width: [7,13, 0,0],
        transition: {
            duration: 0.6,
            ease: easeOut,
        },
    }

    return (
        <motion.button
            style={
                removed ?
                {
                    display: "none"
                }
                :
                {
                    width: "fit-content",
                    position: "absolute",
                    right: 0,
                    top: 175,
                    height: 80,
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                }
            }
            onHoverStart={() => setHovering(true)}
            onHoverEnd={() => setHovering(true)}
            
            onClick={() => setPower(true)}
        >
            <motion.div
                style={{
                    width: 7,
                    height: "100%",
                    backgroundColor: "white",
                    borderBottomLeftRadius: 7,
                    borderTopLeftRadius: 7,
                    position: "absolute",
                    right: 0,
                }}
                animate={
                    power ?
                    clickedAnimation
                    :
                    {
                        width: [20, 7],
                        transition: {
                            duration: 0.6,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }
                    }
                }

            />
            <motion.div
                style={{
                    width: "fit-content",
                    marginRight: 25,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                animate={
                    power ?
                    {
                        x: [0,-25],
                        opacity: [1,1,0],
                        scale: 0.8,
                        color: "var(--primary)"
                    }
                    :
                    {
                        x: [-3, 0]
                    }
                }
                transition={
                    power ?
                    {
                        duration: 0.4
                    }
                    :
                    {
                        duration: 0.6,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }
                }
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: 5}}>
                    <circle cx="8" cy="8" r="8" fill="var(--box-fill-bright"/>
                    <path d="M10.0321 3.04238C10.1578 3.11545 10.2164 3.2655 10.1737 3.40441L9.04812 7.06251H11.125C11.2497 7.06251 11.3624 7.13661 11.4119 7.25106C11.4613 7.36551 11.438 7.4984 11.3526 7.58919L6.35257 12.9017C6.25296 13.0075 6.09353 13.0307 5.96789 12.9576C5.84225 12.8846 5.78358 12.7345 5.82633 12.5956L6.9519 8.93751H4.87501C4.75033 8.93751 4.63759 8.8634 4.58814 8.74896C4.53869 8.63451 4.562 8.50162 4.64744 8.41083L9.64744 3.09833C9.74706 2.9925 9.90649 2.9693 10.0321 3.04238Z" fill="var(--primary)"/>
                </svg>
                Power
            </motion.div>
        </motion.button>
        
    )
}
const ReturnButton = ({stats, page, setPage, fadeOutAnimation}) => {
    return (
        page && !fadeOutAnimation != 0 ?
        <motion.button
            style={{
                position: "absolute",
                left: 25,
                top: 25,
                display: "flex",
                width: "fit-content",
                height: "fit-content",
                background: "none",
                border: "none",
                cursor: "pointer"
            }}
            onClick={setPage}
            animate={{
                opacity: [0,0,1],
                scale: [0,1],
                x: ["-50%", "0%"],
                y: [50,0],
                transition: {duration: 0.6, ease: easeOut}
            }}
        >
            <motion.div
                style={{
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <svg width="25" height="25" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M21.2879 3.08709C21.654 3.4532 21.654 4.0468 21.2879 4.41291L10.7008 15L21.2879 25.5871C21.654 25.9532 21.654 26.5468 21.2879 26.9129C20.9218 27.279 20.3282 27.279 19.9621 26.9129L8.71209 15.6629C8.34597 15.2968 8.34597 14.7032 8.71209 14.3371L19.9621 3.08709C20.3282 2.72097 20.9218 2.72097 21.2879 3.08709Z" fill="var(--secondary)"/>
                </svg>

            </motion.div>
            <motion.div
                style={{
                    width: "fit-content",
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    color: "var(--secondary)"
                }}
            >
                {stats[0].title}
            </motion.div>
        </motion.button>
        :
        ""
    )
}
const PhoneBox = ({children}) => {


    return (
        <motion.div 
            style={{
                height: "705.6px",
                width: "368.1px",
                background: "green",
                borderRadius: 60,
                border: "8px solid var(--phone-border)",
                backgroundColor: "black",

                boxShadow: "0 0 100px 0.5px var(--phone-blur)",
                display: "flex",
                justifyContent: "center",
                position: "relative",
                opacity: 0,
                scale: 0.9
            }}
            whileInView={{
                opacity: 1,
                scale: [0.9,1.0125,1],
                transition: {
                    duration: 1.1
                }
            }}
        >
            {children}
        </motion.div>
    )
}
const Heading = ({title, fadeOutAnimation, page}) => {
    return (
        <motion.h3 style={{
                position: "absolute",
                left: "36px",
                top: "82px",
                color: "var(--white-text)",
                width: 300
            }}
            animate={
                fadeOutAnimation == false ?
                {
                    opacity: [0,1],
                    scale: [0.25,1],
                    x: [-112.5,0]
                }
                :
                {

                }
            }
            transition={{
                duration: 0.55,
                ease: easeOut
            }}
        >
            {fadeOutAnimation == false ? title : ""}
        </motion.h3>
    )
}
const BarChart = ({page, setFadeOutAnimation, fadeOutAnimation}) => {
    return (
        <div
            style={{
                height: "fit-content",
                width: "246.15px",
                position: "absolute",
                top: "146.7px",
                left: "50.4px"
            }}
        >
            {
                page.emmisions.map( (value, index) => {
                    if (index < 10) {
                        return (
                            <Bar
                                value={value}
                                maxValue={maxValue(page.emmisions)}
                                key={index}
                                index={index}
                                setFadeOutAnimation={setFadeOutAnimation}
                                fadeOutAnimation={fadeOutAnimation}
                            />
                        )
                    }
                })
            }
            {!fadeOutAnimation && page.source != "" ?
            <motion.button 
                style={{
                    position: 'absolute',
                    width: 17.5,
                    height: 17.5,
                    bottom: 45,
                    right: -30,
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: "center",
                    background: "none",
                    border: "none",
                    cursor: "pointer"
                }}
                animate={{
                    opacity: [0,0,0,1],
                    scale: [0,1],
                    transition: {duration: 0.6, delay: 0.3}
                }}
                onClick={() => window.open(page.source)}
            > 
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.44602 3.82812C9.44602 3.52609 9.20118 3.28125 8.89915 3.28125H1.64062C0.734532 3.28125 0 4.01578 0 4.92188V15.8594C0 16.7655 0.734533 17.5 1.64062 17.5H12.5781C13.4842 17.5 14.2188 16.7655 14.2188 15.8594V8.60085C14.2188 8.29882 13.9739 8.05398 13.6719 8.05398C13.3698 8.05398 13.125 8.29882 13.125 8.60085V15.8594C13.125 16.1614 12.8802 16.4062 12.5781 16.4062H1.64062C1.33859 16.4062 1.09375 16.1614 1.09375 15.8594V4.92188C1.09375 4.61984 1.33859 4.375 1.64062 4.375H8.89915C9.20118 4.375 9.44602 4.13016 9.44602 3.82812Z" fill="#0591DE"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M17.5 0.546875C17.5 0.244844 17.2552 0 16.9531 0H11.4844C11.1823 0 10.9375 0.244844 10.9375 0.546875C10.9375 0.848906 11.1823 1.09375 11.4844 1.09375H15.6329L6.72268 10.0039C6.50911 10.2175 6.50911 10.5638 6.72268 10.7773C6.93624 10.9909 7.28251 10.9909 7.49607 10.7773L16.4062 1.86715V6.01562C16.4062 6.31766 16.6511 6.5625 16.9531 6.5625C17.2552 6.5625 17.5 6.31766 17.5 6.01562V0.546875Z" fill="#0591DE"/>
                </svg>
            </motion.button>
            
            : ""}
            {!fadeOutAnimation ? <motion.div
                animate={{
                    opacity: [0,0,0,1],
                    transition: {duration: 1}
                }}
                style={{
                    position: 'absolute',
                    width: "fit-content",
                    height: "fit-content",
                    bottom: 22.5,
                    right: -30,
                    bottom: 22.5,
                    fontSize: 11,
                    textAlign: "right",
                    color: "var(--neutral-text)",
                    fontWeight: 800
                }}
            >
                grams CO
                <span 
                    style={{fontSize:8, color: "var(--neutral-text)",
                    fontWeight: 800}}
                >2 </span>
                 per minute
            </motion.div> : ""}
        </div>
    )
}
const Bar = ({value, maxValue, index, setFadeOutAnimation, fadeOutAnimation}) => {
    const width = parseFloat(190.35 / maxValue * value.value).toFixed(2);
    const [hovering, setHovering] = useState(false);

    const fadeOut = {
        animate: {
            opacity: 0
        },
        transition: {
            duration: 1
        },
        onAnimationComplete: () => {
            setFadeOutAnimation(false);
        }
    }
    const fadeIn = {
        animate: {
            y: [-(45)*index, 10,0],
            opacity: [0,0,1]
        },
        transition: {
            duration: 0.7,
            delay: 0.05*index,
            ease: easeOut
        }
    }

    const chosenAnimation = fadeOutAnimation ? fadeOut : fadeIn;

    return (
        <motion.div 
            style={{
                display: "flex",
                height: "22.5px",
                alignItems: "center",
                marginBottom: "22.5px",
                position: "relative",
                width: "fit-content",
            }}
            {...chosenAnimation}
        >
            {/* Description */}
            <motion.div className={phoneCSS.Bar_Description}>
                {fadeOutAnimation ? "" : value.desc}
            </motion.div>
            {/* Bar itself */}
            <motion.div
                className={phoneCSS.Bar_Rectangle}
                whileHover={{
                    filter: "brightness(0.5)",
                    background: "linear-gradient(to right, rgb(24, 160, 251), rgba(33, 242, 103))",
                    backgroundSize: "190.35px",
                    transition: {
                        duration: 0.1,
                    }
                }}
                animate={{
                    width: width+"px",
                    transition: {
                        duration: 1,
                        ease: easeOut
                    }
                }}
                
                onHoverStart={() => setHovering(true)}
                onHoverEnd={() => setHovering(false)}
            />
            {/* Emission Value */}
            <motion.div 
                style={{
                    width: "52px",
                    fontSize: "11px",
                    position: "relative",
                    marginLeft: 5,
                    opacity: 0,
                    scale: 0.25,
                    x: -10,
                    fontWeight: 800,
                    backdropFilter: "blur(6px)"
                }}
                animate={{
                    opacity: hovering ? [0,0,1] : 0,
                    scale: hovering ? 1 : 0.25,
                    x: hovering ? 0 : -50
                }}
                transition={{
                    duration: 0.4
                }}
            >
                {value.value}
            </motion.div>
        </motion.div>
    )
}
const MenuBar = ({children}) => {
    return (
        <motion.div 
            className={styles.phone_menubar}
            animate={{
                opacity: 1,
                scale: [0.9,1]
            }}
            transition={{
                duration: 0.4,
                delay: 0.5
            }}
        >
            {children}
        </motion.div>
    )
}
const Button = ({onClick, page, id, icon}) => {
    return (
        <motion.div 
            onClick={onClick}
            className={styles.appicon}
            animate={
                page == id ?
                {
                    backgroundColor: "var(--primary)"
                }
                :
                {
                    backgroundColor: "var(--phone-appicon)"
                }
            }
            
            transition={{
                duration: 0.3
            }}
        >
            {icon}
        </motion.div>
    )
}
const Description = ({text, fadeOutAnimation}) => {
    return (
        <motion.div
            style={{
                width: "297px",
                height: "108px",
                position: "absolute",
                bottom: "210px",
                fontWeight: 200
            }}
            animate={
                fadeOutAnimation == false ?
                {
                    opacity: [0,0,1],
                    y: [60,-5,0]
                }
                :
                {

                }
            }
            transition={{
                duration: 0.55,
                delay: 0.3
            }}
        >
            {fadeOutAnimation == false ? text : ""}
        </motion.div>
    )
}



const InstagramIcon = ({active}) => {
    return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path 
                d="M22.0022 0.399963C16.1359 0.399963 15.3997 0.425614 13.0957 0.530465C10.7962
                0.635766 9.22654 0.99982 7.85312 1.53398C6.43246 2.08568 5.22735 2.82369 4.02673
                4.02475C2.82522 5.22536 2.08721 6.43048 1.53371 7.85069C0.998202 9.22455 0.633699
                10.7946 0.530198 13.0932C0.427147 15.3973 0.400146 16.1339 0.400146 22.0002C0.400146
                27.8664 0.426247 28.6004 0.530648 30.9044C0.636399 33.204 1.00045 34.7736 1.53416
                36.147C2.08631 37.5676 2.82432 38.7728 4.02538 39.9734C5.22555 41.1749 6.43066 41.9147
                7.85042 42.4664C9.22474 43.0006 10.7948 43.3646 13.0939 43.4699C15.3979 43.5748 16.1337
                43.6004 21.9995 43.6004C27.8662 43.6004 28.6001 43.5748 30.9042 43.4699C33.2037 43.3646
                34.7751 43.0006 36.1494 42.4664C37.5696 41.9147 38.7729 41.1749 39.9731 39.9734C41.1746
                38.7728 41.9126 37.5676 42.4661 36.1474C42.9971 34.7736 43.3616 33.2035 43.4696 30.9049C43.5731
                28.6009 43.6001 27.8664 43.6001 22.0002C43.6001 16.1339 43.5731 15.3977 43.4696 13.0937C43.3616
                10.7942 42.9971 9.22455 42.4661 7.85114C41.9126 6.43048 41.1746 5.22536 39.9731 4.02475C38.7716
                2.82324 37.5701 2.08523 36.1481 1.53398C34.7711 0.99982 33.2005 0.635766 30.901 0.530465C28.597
                0.425614 27.8635 0.399963 21.9954 0.399963H22.0022ZM20.0645 4.2925C20.6396 4.2916 21.2813 4.2925
                22.0022 4.2925C27.7694 4.2925 28.453 4.3132 30.7305 4.41671C32.8365 4.51301 33.9795 4.86491 34.7409
                5.16056C35.7489 5.55207 36.4676 6.02007 37.2231 6.77608C37.9791 7.53209 38.4471 8.25209 38.8395
                9.26011C39.1352 10.0206 39.4876 11.1636 39.5834 13.2696C39.6869 15.5467 39.7094 16.2307 39.7094
                21.9952C39.7094 27.7598 39.6869 28.4438 39.5834 30.7208C39.4871 32.8268 39.1352 33.9699 38.8395
                34.7304C38.448 35.7384 37.9791 36.4561 37.2231 37.2117C36.4671 37.9677 35.7494 38.4357 34.7409
                38.8272C33.9804 39.1242 32.8365 39.4752 30.7305 39.5715C28.4534 39.675 27.7694 39.6975 22.0022
                39.6975C16.2345 39.6975 15.5509 39.675 13.2739 39.5715C11.1679 39.4743 10.0248 39.1224 9.26299
                38.8268C8.25498 38.4353 7.53497 37.9673 6.77896 37.2112C6.02295 36.4552 5.55495 35.737 5.16255
                34.7286C4.86689 33.9681 4.51454 32.8251 4.41869 30.719C4.31519 28.442 4.29449 27.758 4.29449
                21.9898C4.29449 16.2217 4.31519 15.5413 4.41869 13.2642C4.51499 11.1582 4.86689 10.0152 5.16255
                9.25381C5.55405 8.24579 6.02295 7.52579 6.77896 6.76978C7.53497 6.01377 8.25498 5.54577 9.26299
                5.15336C10.0244 4.85636 11.1679 4.50536 13.2739 4.40861C15.2665 4.3186 16.0387 4.2916 20.0645
                4.2871V4.2925ZM33.5322 7.87904C32.1012 7.87904 30.9402 9.0387 30.9402 10.4702C30.9402 11.9012
                32.1012 13.0622 33.5322 13.0622C34.9632 13.0622 36.1242 11.9012 36.1242 10.4702C36.1242 9.03915
                34.9632 7.87814 33.5322 7.87814V7.87904ZM22.0022 10.9076C15.8763 10.9076 10.9096 15.8743 10.9096
                22.0002C10.9096 28.1261 15.8763 33.0905 22.0022 33.0905C28.1281 33.0905 33.093 28.1261 33.093
                22.0002C33.093 15.8743 28.1276 10.9076 22.0017 10.9076H22.0022ZM22.0022 14.8001C25.9784 
                14.8001 29.2022 18.0235 29.2022 22.0002C29.2022 25.9764 25.9784 29.2003 22.0022 29.2003C18.0255 
                29.2003 14.8021 25.9764 14.8021 22.0002C14.8021 18.0235 18.0255 14.8001 22.0022 14.8001Z" 
                
                fill= {active ? "black" : "white"} transition={ {duration: 0.3 } }
                />
        </svg>

    )
}

const PinterestIcon = ({active}) => {
    return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.5999 6.10352e-05C9.67067 6.10352e-05 0 9.67073 0 21.6C0 30.7508 5.69337 38.5735 13.7284 41.7207C13.5396 40.0117 13.3689 37.3835 13.8032 35.5178C14.1958 33.832 16.3361 24.7812 16.3361 24.7812C16.3361 24.7812 15.69 23.4873 15.69 21.5743C15.69 18.5708 17.4309 16.3285 19.5984 16.3285C21.4413 16.3285 22.3313 17.7121 22.3313 19.3711C22.3313 21.2244 21.1514 23.9952 20.5425 26.563C20.0336 28.7128 21.6206 30.4661 23.7411 30.4661C27.5801 30.4661 30.5312 26.4181 30.5312 20.575C30.5312 15.4032 26.815 11.7873 21.5087 11.7873C15.3628 11.7873 11.7554 16.3971 11.7554 21.161C11.7554 23.0175 12.4705 25.0082 13.3629 26.0904C13.5394 26.3043 13.5653 26.4916 13.5127 26.7099C13.3487 27.3921 12.9843 28.8593 12.9128 29.1596C12.8186 29.5549 12.5998 29.6389 12.1904 29.4483C9.49272 28.1926 7.80605 24.2484 7.80605 21.0805C7.80605 14.2669 12.7566 8.00937 22.078 8.00937C29.571 8.00937 35.394 13.3488 35.394 20.4845C35.394 27.9286 30.7003 33.9196 24.1855 33.9196C21.9967 33.9196 19.9391 32.7826 19.2347 31.4394C19.2347 31.4394 18.1517 35.5635 17.8891 36.5741C17.4015 38.4502 16.085 40.802 15.2045 42.2367C17.2255 42.8624 19.3732 43.1999 21.5999 43.1999C33.5293 43.1999 43.2 33.5292 43.2 21.6C43.2 9.67073 33.5293 6.10352e-05 21.5999 6.10352e-05Z"
            fill= {active ? "black" : "white"} transition={ {duration: 0.3 } }
            />
        </svg>
    )
}
const RedditIcon = ({active}) => {

    return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.6512 21.6C15.4139 21.6 14.4087 22.6052 14.4087 23.8424C14.4087 25.0797 15.4139 26.1107 16.6512 26.0849C17.8884 26.0849 18.8937 25.0797 18.8937 23.8424C18.8937 22.6052 17.8884 21.6 16.6512 21.6Z"     fill= {active ? "black" : "white"} transition={ {duration: 0.3 } }/>
            <path d="M21.6259 31.4463C22.4765 31.4463 25.4149 31.3432 26.9614 29.7966C27.1677 29.5646 27.1677 29.2038 26.9614 28.9718C26.7295 28.7398 26.3686 28.7398 26.1366 28.9718C25.1829 29.9513 23.0951 30.2863 21.6259 30.2863C20.1567 30.2863 18.0946 29.9513 17.1151 28.9718C16.8832 28.7398 16.5223 28.7398 16.2903 28.9718C16.0583 29.2038 16.0583 29.5646 16.2903 29.7966C17.8111 31.3174 20.7495 31.4463 21.6259 31.4463Z"     fill= {active ? "black" : "white"} transition={ {duration: 0.3 } }/>
            <path d="M24.3066 23.8682C24.3066 25.1054 25.3118 26.1107 26.549 26.1107C27.7863 26.1107 28.7915 25.0797 28.7915 23.8682C28.7915 22.631 27.7863 21.6257 26.549 21.6257C25.3118 21.6257 24.3066 22.631 24.3066 23.8682Z"     fill= {active ? "black" : "white"} transition={ {duration: 0.3 } }/>
            <path d="M43.2 21.6C43.2 33.5294 33.5294 43.2 21.6 43.2C9.67065 43.2 0 33.5294 0 21.6C0 9.67065 9.67065 0 21.6 0C33.5294 0 43.2 9.67065 43.2 21.6ZM32.8641 18.4553C32.0135 18.4553 31.2402 18.7904 30.6731 19.3317C28.508 17.7852 25.5438 16.7799 22.2445 16.651L23.6879 9.89781L28.3791 10.9031C28.4307 12.0887 29.4101 13.0424 30.6216 13.0424C31.8588 13.0424 32.8641 12.0372 32.8641 10.8C32.8641 9.56272 31.8588 8.55747 30.6216 8.55747C29.7452 8.55747 28.9719 9.07298 28.6111 9.82048L23.3786 8.71213C23.224 8.68635 23.0693 8.71212 22.9662 8.78945C22.8373 8.86678 22.76 8.99566 22.7342 9.15031L21.1361 16.6768C17.7853 16.7799 14.7696 17.7852 12.5786 19.3575C12.0116 18.8162 11.2383 18.4811 10.3877 18.4811C8.63495 18.4811 7.24307 19.8988 7.24307 21.6257C7.24307 22.9145 8.01634 23.9971 9.09892 24.4868C9.04736 24.7961 9.02159 25.1054 9.02159 25.4405C9.02159 30.2863 14.6665 34.23 21.6259 34.23C28.5853 34.23 34.2302 30.3121 34.2302 25.4405C34.2302 25.1312 34.2044 24.7961 34.1529 24.4868C35.2354 23.9971 36.0087 22.8887 36.0087 21.6C36.0087 19.8472 34.591 18.4553 32.8641 18.4553Z" fill= {active ? "black" : "white"} transition={ {duration: 0.3 } }/>
        </svg>

    )
}
const TikTokIcon = ({active}) => {

    return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24.3 -2.99811e-06L29.6475 -3.05176e-05C30.0336 1.9305 31.1056 4.36602 32.9805 6.78222C34.8177 9.14973 37.2522 10.8 40.5 10.8V16.2C35.7658 16.2 32.2084 14.0034 29.7 11.2627V29.7C29.7 37.1558 23.6558 43.2 16.2 43.2C8.74411 43.2 2.69995 37.1558 2.69995 29.7C2.69995 22.2442 8.74411 16.2 16.2 16.2V21.6C11.7264 21.6 8.09995 25.2265 8.09995 29.7C8.09995 34.1735 11.7264 37.8 16.2 37.8C20.6735 37.8 24.3 34.1735 24.3 29.7V-2.99811e-06Z" fill= {active ? "black" : "white"} transition={ {duration: 0.3 } }/>
        </svg>

    )
}
export default Phone;