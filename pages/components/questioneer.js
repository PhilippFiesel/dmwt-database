import useSWR from 'swr';
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import styles from '../../styles/Home.module.css';
import {animate, delay, easeIn, easeInOut, easeOut, motion, spring, wrap} from "framer-motion"


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
    const [resultsAreIn, setResultsIn] = useState(false);
    const weight = useRef(0);

    const [submitFadeOut, setSubmitFadeOut] = useState(false);
    const [showResultScreen, setResultScreen] = useState(false);
;
    if (!data) return ""; // TODO maybe loading screen?
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
                setSubmitAnimation(true);
            }
    
            else if (onLastPage) {
                // submit to database
                setSubmit(true);
                handleSubmit(weight.current, setSuccessfulTransfer, setResultScreen);
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
                                        weight.current = weight.current - data.questions[currentPage].answers[index].weight;
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
                                // increase or decrease weight of question
                                
                                if (updatedActive[currentPage][buttonID] == false) {
                                    weight.current = weight.current - button.weight;
                                } 
                            }

                            if (updatedActive[currentPage][buttonID] == true) {
                                weight.current = weight.current + button.weight;
                                setNextError(false);
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
                                    onClick={() => click()}
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
                    showResultScreen={showResultScreen}
                    resultsAreIn={resultsAreIn}
                />

                <ErrorMessage nextError={nextError} />

                {
                    showResultScreen ?
                    <ResultScreen
                        weight={weight.current}
                        setResultsIn={() => setResultsIn(true)}
                        data={data}
                    /> : ""
                }

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
            whileInView={{
                opacity: [0,1],
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
const AnswerText = ({index, text, activeState, fadeOutAnimation, onClick}) => {
    
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
            onClick={onClick}
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
const PageIndicator = ({currentPage, amountPages, submitted, successfulTransfer,resultsAreIn}) => {


    const relation = ((currentPage) / amountPages)*-1;

    var loadingAnimation = {};

    if (submitted) {
        if (successfulTransfer) {
            loadingAnimation = {
                animate: {
                    strokeDashoffset: 0,
                    strokeDasharray: 122.3, // 100%
                    stroke: "var(--primary)"
                },
                transition: {
                    duration: 0.55,
                    ease: easeOut,
                }
            }
        }
        else {
            loadingAnimation = {
                animate: {
                    strokeDashoffset: [18.345,18.345],
                    strokeDasharray: 122.3, // 100%
                    stroke: ["var(--secondary)","var(--secondary)"],
                    rotate: -360
                },
                transition: {
                    duration: 0.4,
                    repeat: Infinity,
                    ease: easeInOut,
                    repeatType: "reverse"
                }
            }   
        }
    }
    else {
        loadingAnimation = {
            animate: {
                strokeDashoffset: 122.3 - 122.3 * relation,
                strokeDasharray: 122.3, // 100%

                stroke: "var(--primary)",
            },
            transition: {
                ease: easeOut,
                duration: 0.3,
            }
        }
    }


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
                !resultsAreIn ?
                {
                    transform: "translate(-0%, -0%) scale(1.35)",
                    transition:{
                        duration: 0.4,
                        ease: easeOut
                    }
                }
                :
                {
                    opacity: [1, 0],
                    transform: "translate(-0%, -0%)"
                }
                :
                {}
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
                    {...loadingAnimation}
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
const ArrowLeft = ({weight}) => {
    return (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M33 22C33 21.2406 32.3844 20.625 31.625 20.625H15.6945L21.5973 14.7223C22.1342 14.1853 22.1342 13.3147 21.5973 12.7777C21.0603 12.2408 20.1897 12.2408 19.6527 12.7777L11.4027 21.0277C10.8658 21.5647 10.8658 22.4353 11.4027 22.9723L19.6527 31.2223C20.1897 31.7592 21.0603 31.7592 21.5973 31.2223C22.1342 30.6853 22.1342 29.8147 21.5973 29.2777L15.6945 23.375H31.625C32.3844 23.375 33 22.7594 33 22Z" fill="white"/>
        </svg>
    )
}
const ResultScreen = ({setResultsIn, weight}) => {
    // fetch average result from database
    const average = getAvgFromDB();
    var color = "";

    const DetermineCategory = ( value ) => {

        const isAboveAverage = value > average;
        const aboveOrBelow = isAboveAverage ? "above" : "below";
        const differencePercent = Math.abs((value / average * 100) - 100).toFixed(2)

        if (value >= 9) {
            color = "var(--danger)";
            return  {"category":"High", "text":`You are ${differencePercent} % ${aboveOrBelow} the average`};
        } 
        if (value <= 5) {
            color = "var(--success)";
            return {"category":"Low", "text":`You are ${differencePercent} % ${aboveOrBelow} the average`};
        } 
        if (value >5 && value < 9){
            color = "var(--attention)";
            return {"category":"Medium", "text":`You are ${differencePercent} % ${aboveOrBelow} the average`};
        }
    };

    const style_box = {
        position: "absolute",
        left: "10%",
        backgroundColor: "var(--box-fill-bright",
        width: "80%",
        height: 80,
        borderRadius: 18,
        display: "flex",
        alignItems: "center"
    }
    const style_heading = {
        marginTop: 0,
        width: "50%",
        left: 20,
        color: "white",
        position: "absolute",
        fontSize: 18,
        fontWeight: 800
    }
    const style_value = {
        fontSize: 16,
        fontWeight: 800,
    }

    const stye_value_box = {
        width: 60,
        height: 60,
        backgroundColor: "var(--box-fill)",
        boxShadow: "0 0 20px 1px rgba(255,255,255, 0.05)",
        position: "absolute",
        right: 20,
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }

    const Your_Result = () => {
        return (
            <div
                style={{
                    top: "17.5%",
                    ...style_box,
                }}
            >
                <motion.h3
                    style={style_heading}
                >
                    Your Emission Score
                </motion.h3>

                <motion.div
                    style={{
                        position: "absolute",
                        right : 85,
                        width: 60,
                        height: 60,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        y: -5
                    }}
                >
                    <Battery scale={0.4}/>
                    <motion.div
                    style={{
                        position: "absolute",
                        textAlign: "center",
                        width: 95,
                        fontWeight: 800,
                        color: "white",
                        fontSize: 14,
                        y: 25,
                        x: -1
                    }}
                >
                    {DetermineCategory(weight).category}
                </motion.div>
                </motion.div>

                <motion.div
                    style={stye_value_box}
                >
                    <motion.div
                        style={{
                            ...style_value,
                            color: "var(--primary)"
                        }}
                    >
                        {parseFloat(weight).toFixed(2)}
                    </motion.div>
                </motion.div>
            </div>
        )
    }
    const Average_Result = () => {
        return (

            <div
                style={{
                    top: "35%",
                    ...style_box
                }}
            >
                <motion.h3
                    style={style_heading}
                >
                    Average Emission Score
                </motion.h3>

                <motion.div
                    style={stye_value_box}
                >
                    <motion.div
                        style={style_value}
                    >
                        {average}
                    </motion.div>
                </motion.div>
            </div>
        )
    }
    const Result_Heading = () => {
        return (
            <motion.h3
                style={{
                    height: 49,
                    position: "absolute",
                    top: "5%",
                    left: "5%"
                }}
            >
                Questioneer Results
            </motion.h3>
        )
    }
    const Battery = ({scale}) => {
        const high = 14;

        var width = 79 / (high) * weight;
        if (weight <= 4) {
            width = 24;
        }

        return (
            <motion.div
                style={{
                    scale: scale
                }}
            >
                <svg width="103" height="54" viewBox="0 0 103 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2.5" y="2.5" width="90" height="49" rx="13.5" stroke="var(--neutral-text)" stroke-width="5"/>
                    <rect x="8" y="8" width="79" height="38" rx="8" fill="var(--box-fill)"/>
                    <rect x="8" y="8" width={width} height="38" rx="8" fill="var(--primary)"/>
                    <path d="M97 20V20C100.314 20 103 22.6863 103 26V27C103 30.3137 100.314 33 97 33V33V20Z" fill="var(--neutral-text)"/>
                </svg>
                
            </motion.div>
        )
    }
    const Result_Text = () => {
        return (
            <div
                style={{
                    width: "80%",
                    position: "absolute",
                    top: "52.5%",
                    left: "10%",
                    height: 80,
                    borderRadius: 18,
                    backgroundColor: "var(--box-fill-bright)",
                    
                }}
            >
                <h3
                    style={{
                        marginTop: 0,
                        display: "flex",
                        alignItems: "center",
                        width: "90%",
                        left: 20,
                        height: "100%",
                        position: "absolute",
                        overflow: "hidden",
                        color: "white",
                        fontSize: 18,
                        fontWeight: 800,
                        background: "linear-gradient(to right, var(--secondary), var(--primary))",
                        color: "transparent",
                        WebkitBackgroundClip: "text"
                    }}
                >
                    {DetermineCategory(weight).text}
                </h3>
            </div>
        )
    }

    return (
        <motion.div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                opacity: 0
            }}
            animate={{
                opacity: [0,1]
            }}
            transition={{
                duration: 1,
                delay: 1
            }}
            onAnimationComplete={setResultsIn}
        >
            <Result_Heading/>
            <Your_Result/>
            <Average_Result/>
            <Result_Text/>
        </motion.div>
    )
}
const ErrorMessage = ({nextError}) => {
    var animation = {};
    var transition = {};

    if (nextError) {
        animation = {
            opacity: [0,1],
            x: [-25, 3, 0],
            y: [3, 0],
            filter: ["blur(5px)","blur(0px)", "blur(0px)"],
            scaleY: [0.5, 1]
        }
        transition = {
            duration: 0.6
        }
    }
    else {
        animation = {
            opacity: 0
        }
        transition = {
            duration: 0.3
        }
    }


    return (
        <motion.div
            style={{
                color: "var(--attention)",
                position: "absolute",
                left: "10%",
                bottom: 95,
                opacity: 0,
                userSelect: "none"
            }}
            animate={animation}
            transition={transition}
        >
            {"Please select at least one answer :)"}
        </motion.div>
    )
}

// database submit
const handleSubmit = async (weight, setSuccessfulTransfer, setResultScreen) => {

    await fetch('../api/questioneerresult', {
        method: 'POST',
        body: JSON.stringify({ result: weight })
    });
    setSuccessfulTransfer(true);
    setResultScreen(true)
}
const getAvgFromDB = () => {
    const [average, setAverage] = useState();

    const fetchData = async () => {
      try {
        const response = await fetch('../api/questioneerresult', {method:'GET'});
        const data = await response.json(); 
        setAverage(data.average);
      }
      catch (error) {
        console.error('Error fetching average:', error);
      }
    };

    fetchData();

    return parseFloat(average).toFixed(2);
}

export default Questioneer;