import styles from '../../styles/Home.module.css';
import useSWR from 'swr';
import { useState } from 'react';

function maxValue(arr) {
    let max = arr[0].value; // Annahme: Das erste Element ist das größte
    for (let i = 1; i < arr.length; i++) {
        if (arr[i].value > max) {
            max = arr[i].value; // Aktualisiere das Maximum, wenn ein größeres Element gefunden wird
        }
    }
    return max; // Rückgabe des größten Elements
}

const bars = (value, maxValue) => {
    const width = parseFloat(190.35 / maxValue * value.value).toFixed(2);

    return (
        <div style={
            {
                display: "flex",
                height: "22.5px",
                alignItems: "center",
                marginBottom: "22.5px",
                position: "relative",
                width: "fit-content"
            }}>
            <div style={{
                left: 0, width: "52px", fontSize: "11px",
                position: "relative", left: "0px", marginRight: "15px"
                }}>{value.desc}</div>

            <div style={{
                width: width + "px",
                height: "22.5px",
                backgroundColor: "var(--primary)",
                borderRadius: "10px",
                position: "relative"
            }}></div>
        </div>
    )
}

const Phone = () => {

    // fetching data from json
    const {data,error} = useSWR("data/stats.json", (url) => fetch(url).then((res) => res.json()));


    const [page, setPage] = useState(0);


    if (!data) return <div>NULL</div>;

    // stats from json
    const stats = data.stats;
    const currentPage = stats[page];

    const switchPage = (number) => {
        const onDefaultScreen = number == 0;

        setPage(number);

        if (number == page) {
            setPage(0);
        }

        if (onDefaultScreen) {
        }

        if (number > 0) {

        }
        else {

        }
        
    }

    return (
        <div className={styles.phone_container}>
            <div style={{
                height: "705.6px",
                width: "368.1px",
                background: "green",
                borderRadius: 60,
                border: "8px solid var(--phone-border)",
                backgroundColor: "black",

                boxShadow: "0 0 100px 0.5px var(--phone-blur)",
                display: "flex",
                justifyContent: "center",
                position: "relative"
            }}>

                <h3 style={{
                    position: "absolute",
                    left: "36px",
                    top: "82px"
                }}> {currentPage.title} </h3>


                <div style={{height: "fit-content", width: "246.15px", position: "absolute", top: "146.7px", left: "50.4px"}}>
                    {currentPage.emmisions.map( (value, index) => {
                        if (index < 10) {
                            return bars(value, maxValue(currentPage.emmisions));
                        }
                    })}
                </div>
                
                <div className={styles.phone_menubar}>
                    <div onClick={() => switchPage(1)} className={styles.appicon} style={page == 1 ? {backgroundColor: "var(--primary)"} : {backgroundColor: "#082438"}}></div>
                    <div onClick={() => switchPage(2)} className={styles.appicon} style={page == 2 ? {backgroundColor: "var(--primary)"} : {backgroundColor: "#082438"}}></div>
                    <div onClick={() => switchPage(3)} className={styles.appicon} style={page == 3 ? {backgroundColor: "var(--primary)"} : {backgroundColor: "#082438"}}></div>
                    <div onClick={() => switchPage(4)} className={styles.appicon} style={page == 4 ? {backgroundColor: "var(--primary)"} : {backgroundColor: "#082438"}}></div>
                </div>

            </div>
        </div>
    )
}

export default Phone;