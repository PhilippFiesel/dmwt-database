import useSWR from 'swr';
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import styles from '../../styles/Home.module.css';
import {animate, delay, easeIn, easeInOut, easeOut, motion, spring, wrap} from "framer-motion"

var weight = 0;
var answerAnimation;
var width = 0;

const Questioneer = () => {
    // fetching questioneer data from json
    const {data,error} = useSWR("data/questions.json", (url) => fetch(url).then((res) => res.json()));
   
    const [currentPage, setPage] = useState(0); // states for the different questioneer pages
    const [active, setActive] = useState([]); // states for answer buttons
    const [nextError, setNextError] = useState(false); // error states

    const [fadeOutAnimation, setFadeOutAnimation] = useState(false);

    const [submitAnimation, setSubmitAnimation] = useState(false);
    const [submitted, setSubmit] = useState(false);
    const [successfulTransfer, setSuccessfulTransfer] = useState(false);

    const [submitFadeOut, setSubmitFadeOut] = useState(false);
;
    if (!data) return <div>NULL</div>; // TODO maybe loading screen?
    const {title: questionTitle, type: questionType} = data.questions[currentPage];


    const switchPage = (type) => {
        const nextExists = !submitted && type == "next" && currentPage < data.questions.length - 1;
        const prevExists = !submitted && type == "prev" && currentPage > 0;
        const onLastPage = !submitted && currentPage == data.questions.length - 1;
        const atleastOneAnswerSelected = () => {
            var valueFound = false;

            active[currentPage].map( (value, index) => {
                if (value == true) {
                    valueFound = true;
                }
            } );

            if (valueFound) {
                return true;
            }
            else {
                return false;
            }
        };

        if (prevExists) {
            setPage(currentPage - 1);
            setNextError(false);
            if (submitAnimation) {
                setSubmitAnimation(false);
            }
            setFadeOutAnimation(true);
            return;
        }

        // only continue if at least one answer selected
        if (atleastOneAnswerSelected()) {

            if (nextExists) {
                setPage(currentPage + 1);
                setFadeOutAnimation(true);
            }

            if (currentPage == data.questions.length - 2) {
                console.log(onLastPage);
                setSubmitAnimation(true);
            }
    
            else if (onLastPage) {
                // submit to database
                setSubmit(true);
                handleSubmit(weight, setSuccessfulTransfer);
            }
        }
        else {
            setNextError(true);
        }
    }

    // initialize empty fields for active states
    if (!active[currentPage]) {
        for (let i = 0; i < data.questions.length; i++) {
            active[i] = [];
        }
    }


    const answers = data.questions[currentPage].answers;

    return (
        <Container>
            <QuestioneerBox>
                <motion.div
                style={submitFadeOut ? {display: "none"} : {}}
                animate={
                    submitted ?
                    {
                        opacity: 0,
                    }
                    :
                    {
                        
                    }
                }
                onAnimationComplete = {() => {if (!submitFadeOut) {setSubmitFadeOut(true)}}}
                transition={{
                    duration: 0.1
                }}
                >
                <Heading 
                    text={questionTitle}
                    fadeOutAnimation={fadeOutAnimation}
                />
                {
                    answers.map((button, buttonID) => {
                        var isActive = active[currentPage][buttonID];

                        // set empty fields to false
                        if (isActive == undefined) {
                            isActive = false;
                        }

                        const click = () => {
                            // copy of active states
                            const updatedActive = [...active];

                            // single choice
                            if (questionType == "single_choice") {
                                // set all to off except the clicked one
                                updatedActive[currentPage].map((inner, index) => {
                                    if (inner == true) {
                                        weight = weight - data.questions[currentPage].answers[index].weight;
                                    }
                                    if (index != buttonID) {
                                        updatedActive[currentPage][index] = false;
                                    }
                                })
                                
                                updatedActive[currentPage][buttonID] = !updatedActive[currentPage][buttonID];
                            }

                            // multiple choice
                            else if (questionType == "multiple_choice") {
                                updatedActive[currentPage][buttonID] = !updatedActive[currentPage][buttonID];
                            }

                            // increase or decrease weight of question
                            if (updatedActive[currentPage][buttonID] == true) {
                                weight = weight + button.weight;
                                setNextError(false);
                            }
                            else {
                                weight = weight - button.weight;
                            }   

                            // render updated state
                            setActive(updatedActive);
                        }

                        // answer buttons
                        return (
                            <Answers 
                                activeState={active[currentPage][buttonID]}
                                index={buttonID}

                                fadeOutAnimation={fadeOutAnimation}
                                setFadeOutAnimation={setFadeOutAnimation}

                                width={width}

                                key={buttonID}
                            >
                                <AnswerButton
                                    onClick={() => click()}
                                    activeState={active[currentPage][buttonID]}
                                />
                                
                                <AnswerText 
                                    text={button.answer}
                                    fadeOutAnimation={fadeOutAnimation}
                                    setFadeOutAnimation={setFadeOutAnimation}
                                />
                            </Answers>
                        );
                    })
                }
                

                <QuestionNavigation>
                    <PrevButton 
                        onClick={() => switchPage("prev")}
                    />

                    <NextButton 
                        onClick={() => switchPage("next")}
                        errorState={nextError}
                        answerAnimation={answerAnimation}
                        submitAnimation={submitAnimation}
                    />
                </QuestionNavigation>
                </motion.div>
                
                <PageIndicator
                    currentPage={currentPage+1}
                    amountPages={data.questions.length}
                    submitted={submitted}
                    successfulTransfer={successfulTransfer}
                />

            </QuestioneerBox>
        </Container>
    )
}


const Container = ({children}) => {
    return (
        <motion.div className={styles.questioneer}>
            {children}
        </motion.div>
    )
}
const QuestioneerBox = ({children}) => {
    return (
        <motion.div 
            className={styles.questioneer_box}
        >
            {children}
        </motion.div>
    )
}
const Heading = ({text, fadeOutAnimation}) => {
    return (
        <motion.h3
            className={styles.questioneer_heading}
            animate={
                fadeOutAnimation == false ?
                {
                    opacity: [0,1]
                }
                :
                {

                }
            }
            transition={{
                duration: 0.8
            }}
        >
            {fadeOutAnimation == false ? text : ""}
        </motion.h3>
    )
}
const Answers = ({index, children, fadeOutAnimation, setFadeOutAnimation}) => {

    const fadeOut = {
        animate: {
            y: [-65 * index],
            opacity: 0,
        },
        transition: {
            duration: 0.15
        },
        onAnimationComplete: () => {
            setFadeOutAnimation(false);
        }
    }
    const fadeIn = {
        animate: {
            y: [- 65 * index, 6, 0],
            opacity: [0,0.5,1],
            scale: [0.7,1,1],
            x: ["-12%","0%","0%"]
        },
        transition: {
            duration: 0.55,
            delay: 0.05 * index,
            ease: easeOut
        }
    }

    const chosenAnimation = fadeOutAnimation ? fadeOut : fadeIn;

    return (
        <motion.div 
            className={
                styles.questioneer_answer_container
            }
            {...chosenAnimation}
        >
            {children}
        </motion.div>
    )
}
const AnswerButton = ({onClick, activeState}) => {
    return (
        <motion.div 
            onClick={onClick}
            className={styles.questioneer_answer_button}
            whileHover={{
                backgroundColor: "rgb(58, 58, 58)",
                transition: {
                    duration: 0.25,
                    type: spring
                }
            }}
        >
            <motion.div 
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "40px",
                    backgroundColor: "var(--secondary)",
                    opacity: 0,
                    scale: 0
                }}
                animate={
                    activeState == true ?
                    {
                        scale: [1, 1.2, 1],
                        opacity: 1,
                    }
                        :
                    {}
                }
                transition={{
                    duration: 0.3,
                    ease: easeOut
                }}
            />
        </motion.div>
    )
}
const AnswerText = ({index, text, activeState, fadeOutAnimation, setFadeOutAnimation}) => {
    
    return (
        <motion.div 
            className={styles.questioneer_answer_text}
            animate={
                activeState === true ?
                {
                    color: "var(--secondary)",
                    scale: [1, 1.025, 1]
                }
                    : 
                {}
            }
            transition={{
                duration: 0.3,
                ease: easeOut
            }}
        >
            {fadeOutAnimation == false ? text : ""}
        </motion.div>
    )
}
const QuestionNavigation = ({children}) => {
    return (
        <motion.div className={styles.questioneer_buttons}>
            {children}
        </motion.div>
    )
}
const PrevButton = ({onClick}) => {
    return (
        <motion.div
            className={styles.prevButton}
            onClick={onClick}
            style={{
                backgroundColor: "#2f2f2f"
            }}
            whileHover={{
                backgroundColor: "#232323"
            }}
            whileTap={{
                scale: 1.1,
                transition: {
                    duration: 0.15
                }
            }}
            transition={{
                duration: 0.2
            }}
        >
            <ArrowLeft/>
        </motion.div>
    )
}
const NextButton = ({onClick, errorState, submitAnimation}) => {
    return (
        <motion.div
            className={styles.nextButton}
            onClick={onClick}
            style={{
                backgroundColor: "#2f2f2f"
            }}
            animate={
                submitAnimation == true ?
                {
                    backgroundColor: "var(--secondary)",
                    width: [52, 145, 135],
                    transition: {
                        duration: 0.6,
                        ease: easeOut
                    }
                } : {}
            }
            transition={{
                duration: 0.3,
                ease: easeOut
            }}

            whileTap={{
                scale: 1.1,
                transition: {duration: 0.15}
            }}
            whileHover={
                submitAnimation == true ?
                {} : {backgroundColor: "#232323"}
            }
        >
            {
                submitAnimation ?
                (
                    <motion.div
                        animate={{opacity: [0,1]}}
                        transition={{duration: 0.5}}
                    >
                        {"Submit"}
                    </motion.div>
                )
                :
                (
                    <ArrowRight
                        errorState={errorState} 
                        submitAnimation={submitAnimation}
                    />
                )
            }
            
        </motion.div>
    )
}
const PageIndicator = ({currentPage, amountPages, submitted, successfulTransfer}) => {


    const relation = ((currentPage) / amountPages)*-1;

    return (
        <motion.div
            style={{
                position: "absolute",
                bottom: 30,
                right: "10%",
                rotate: 90,
                width: "52px",
                height: "52px",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
            animate={
                submitted ?
                {
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) scale(1.35)",
                    transition:{
                        duration: 0.4,
                        ease: easeOut
                    }
                }
                : {}
            }
        >
            <svg width="52" height="52">
                <path
                    d="M6.5298 26C6.5298 36.7531 15.2469 45.4702 26 45.4702C36.7531 45.4702 45.4702 36.7531 45.4702 26C45.4702 15.2469 36.7531 6.5298 26 6.5298C15.2469 6.5298 6.5298 15.2469 6.5298 26Z"
                    fill="none"
                    strokeWidth="6"
                    stroke="var(--box-fill-bright)"
                    strokeLinecap="round"
                />
                <motion.path
                    d="M6.5298 26C6.5298 36.7531 15.2469 45.4702 26 45.4702C36.7531 45.4702 45.4702 36.7531 45.4702 26C45.4702 15.2469 36.7531 6.5298 26 6.5298C15.2469 6.5298 6.5298 15.2469 6.5298 26Z"
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    animate={
                        submitted ?
                        {
                            strokeDashoffset: 0,
                            strokeDasharray: 122.3, // 100%
                            stroke: "var(--primary)",
                            transition: 
                            {
                                duration: 0.55,
                                ease: easeOut
                            }
                        }
                        :
                        {
                            strokeDashoffset: 122.3 - 122.3 * relation,
                            strokeDasharray: 122.3, // 100%

                            stroke: "var(--primary)",

                            transition: {
                                ease: easeOut,
                                duration: 0.3,
                            }
                        }
                    }
                    
                />
            </svg>
            <svg width="23" height="19" viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute'}}>
                <motion.path d="M2 11  L8 17  L21 2"
                animate={successfulTransfer ? {pathLength: [0.15,0.3,0.75,1], opacity: 1} : {pathLength: 0, opacity: 0}}
                transition={{
                    duration: 0.25,
                    delay: 0.3,
                    ease: easeOut
                }}
                stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

        </motion.div>
    )
}
const ArrowRight = ({errorState, submitAnimation}) => {
    if (errorState) {
        return (
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="4" height="14.6667" rx="2" transform="matrix(-1 0 0 1 24 12)" fill="yellow"/>
                <circle cx="2" cy="2" r="2" transform="matrix(-1 0 0 1 24 28)" fill="yellow"/>
            </svg>

        )
    }
    else {
        return (
            <motion.svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"
                animate={
                    submitAnimation ?
                    {
                        opacity: 0
                    }
                    :
                    {
                        opacity: 1
                    }
                }
                transition={
                    {
                        duration: 0.3
                    }
                }
            >
                <path fillRule="evenodd" clipRule="evenodd" d="M11 22C11 21.2406 11.6156 20.625 12.375 20.625H28.3055L22.4027 14.7223C21.8658 14.1853 21.8658 13.3147 22.4027 12.7777C22.9397 12.2408 23.8103 12.2408 24.3473 12.7777L32.5973 21.0277C33.1342 21.5647 33.1342 22.4353 32.5973 22.9723L24.3473 31.2223C23.8103 31.7592 22.9397 31.7592 22.4027 31.2223C21.8658 30.6853 21.8658 29.8147 22.4027 29.2777L28.3055 23.375H12.375C11.6156 23.375 11 22.7594 11 22Z" fill="white"/>
            </motion.svg>
        )
    }
}
const ArrowLeft = () => {
    return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M33 22C33 21.2406 32.3844 20.625 31.625 20.625H15.6945L21.5973 14.7223C22.1342 14.1853 22.1342 13.3147 21.5973 12.7777C21.0603 12.2408 20.1897 12.2408 19.6527 12.7777L11.4027 21.0277C10.8658 21.5647 10.8658 22.4353 11.4027 22.9723L19.6527 31.2223C20.1897 31.7592 21.0603 31.7592 21.5973 31.2223C22.1342 30.6853 22.1342 29.8147 21.5973 29.2777L15.6945 23.375H31.625C32.3844 23.375 33 22.7594 33 22Z" fill="white"/>
        </svg>
    )
}


// database submit
const handleSubmit = async (weight, setSuccessfulTransfer) => {

    await fetch('../api/questioneerresult', {
        method: 'POST',
        body: JSON.stringify({ result: weight })
    });
    setSuccessfulTransfer(true);
}

export default Questioneer;