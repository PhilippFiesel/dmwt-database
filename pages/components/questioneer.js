import useSWR from 'swr';
import { useState } from 'react';
import styles from '../../styles/Home.module.css';

var weight = 0;

const Questioneer = () => {
    // fetching questioneer data from json
    const {data,error} = useSWR("data/questions.json", (url) => fetch(url).then((res) => res.json()));
   
    const [page, setPage] = useState(0); // states for the different questioneer pages
    const [active, setActive] = useState([]); // states for answer buttons
    const [nextError, setNextError] = useState(false); // error states

    if (!data) return <div>NULL</div>; // TODO maybe loading screen?
    const {title,type} = data.questions[page];

    var submitted = false;

    const switchPage = (type) => {
        const nextExists = !submitted && type == "next" && page < data.questions.length - 1;
        const prevExists = !submitted && type == "prev" && page > 0;
        const onLastPage = !submitted && page == data.questions.length - 1;
        const atleastOneAnswerSelected = () => {
            var valueFound = false;

            active[page].map( (value, index) => {
                if (value == true) {
                    // sumWeight = sumWeight + data.questions[page].answers[index].weight;
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
            setPage(page - 1);
            setNextError(false);
            return;
        }

        // only continue if at least one answer selected
        if (atleastOneAnswerSelected()) {

            if (nextExists) {
                setPage(page + 1);
            }
    
            else if (onLastPage) {
                // submit to database
                submitted = true;
                handleSubmit(weight);

                console.log("submitted to database");
            }

        }
        else {
            setNextError(true);
        }
    }

    // initialize empty arrays for active states
    if (!active[page]) {
        for (let i = 0; i < data.questions.length; i++) {
            active[i] = [];
        }
    }

    return (
      <div className={styles.questioneer}>
        <div className={styles.questioneer_box}>
          <h3 className={styles.questioneer_heading}>{title}</h3>
          <div>
            {
                data.questions[page].answers.map((value, current) => {
                    // set empty fields to false
                    if (active[page][current] == null) {
                        active[page][current] = false;
                    }

                    const click = () => {
                        // copy of active states
                        const updatedActive = [...active];

                        // single choice
                        if (type == "single_choice") {
                            // set all to off except the clicked one
                            updatedActive[page].map((inner, index) => {
                                if (inner == true) {
                                    weight = weight - data.questions[page].answers[index].weight;
                                }
                                if (index != current) {
                                    updatedActive[page][index] = false;
                                }
                            })
                            
                            updatedActive[page][current] = !updatedActive[page][current];
                        }

                        // multiple choice
                        else if (type == "multiple_choice") {
                            updatedActive[page][current] = !updatedActive[page][current];
                        }

                        // set state to updated state
                        setActive(updatedActive);

                        // increase or decrease weight of question
                        if (updatedActive[page][current] == true) {
                            weight = weight + value.weight;
                            setNextError(false);
                        }
                        else {
                            weight = weight - value.weight;
                        }   
                    }


                    return (
                        <div className={styles.questioneer_answer_container}>
                            <div onClick={() => click()} className={active[page][current] === false ? styles.questioneer_answer_button : styles.questioneer_answer_button_active}></div>
                            <div className={styles.questioneer_answer_text} style={active[page][current] === false ? {border: "1.5px solid var(--box-fill-bright)"} : {color: "var(--secondary)",border: "1.5px solid var(--secondary)"}}>{value.answer}</div>
                        </div>
                    );
                })
            }
          </div>
  
          <div className={styles.questioneer_buttons}>
            <div onClick={() => switchPage("prev")} className={styles.prevButton}></div>
            <div onClick={() => switchPage("next")} className={
                page == data.questions.length - 1 ? styles.submitButton : styles.nextButton
            }
            style={nextError == true ? {backgroundColor: "var(--attention)"} : {backgroundColor: "var(--background)"}}
            ></div>
          </div>
        
          <div className={styles.currentPageIndex}>{page + 1} / {data.questions.length}</div>
        </div>
      </div>
    )
}

const handleSubmit = async (weight) => {

    await fetch('/api/add-questioneerresult', {
        method: 'POST',
        body: JSON.stringify({ result: weight })
    });
}
  
export default Questioneer;