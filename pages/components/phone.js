import styles from '../../styles/Home.module.css';
import useSWR from 'swr';
import { useState } from 'react';
import {easeOut, motion} from "framer-motion";

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


    const [page, setPage] = useState(0);


    if (!data) return <div>NULL</div>;

    // stats from json
    const stats = data.stats;
    const currentPage = stats[page];

    const switchPage = (clickedButton) => {
        const onDefaultPage = clickedButton == 0;
        const clickOnActiveButton = clickedButton == page;
        const defaultPage = 0;


        setPage(clickedButton);

        if (clickOnActiveButton) {
            setPage(defaultPage);
        }

        if (onDefaultPage) {

        }

        if (clickedButton > 0) {

        }
        else {

        }
        
    }

    return (
        <Container>
            <PhoneBox>

                <Heading title={currentPage.title} />
                <BarChart page={currentPage} />

                <Description text={currentPage.text} />
                
                <MenuBar>
                    <Button
                        onClick={() => switchPage(1)}
                        page={page}
                        id={1}
                        icon={<InstagramIcon/>}
                    />

                    <Button
                        onClick={() => switchPage(2)}
                        page={page}
                        id={2}
                        icon={<PinterestIcon/>}
                    />

                    <Button
                        onClick={() => switchPage(3)}
                        page={page}
                        id={3}
                        icon={<RedditIcon/>}
                    />

                    <Button
                        onClick={() => switchPage(4)}
                        page={page}
                        id={4}
                        icon={<TikTokIcon/>}
                    />
                </MenuBar>

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
const PhoneBox = ({children}) => {
    return (
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
            {children}
        </div>
    )
}
const Heading = ({title}) => {
    return (
        <h3 style={{
                position: "absolute",
                left: "36px",
                top: "82px"
            }
        }>
            {title}
        </h3>
    )
}
const BarChart = ({page}) => {
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
                        return <Bar value={value} maxValue={maxValue(page.emmisions)} key={index}/>
                    }
                })
            }
        </div>
    )
}
const Bar = ({value, maxValue}) => {
    const width = parseFloat(190.35 / maxValue * value.value).toFixed(2);

    return (
        <div 
            style={{
                display: "flex",
                height: "22.5px",
                alignItems: "center",
                marginBottom: "22.5px",
                position: "relative",
                width: "fit-content"
            }}
        >
            <div
                style={{
                        left: 0,
                        width: "52px",
                        fontSize: "11px",
                        position: "relative",
                        left: "0px",
                        marginRight: "15px"
                    }}
            >
                {value.desc}
            </div>

            <motion.div
                style={{
                    width: width + "px",
                    height: "22.5px",
                    background: "linear-gradient(to right, rgba(33, 242, 103), rgb(24, 160, 251))",
                    backgroundSize: "190.35px",
                    borderRadius: "10px",
                    position: "relative"
                }}
                whileHover={{
                    filter: "brightness(0.5)",
                    background: "linear-gradient(to right, rgb(24, 160, 251), rgba(33, 242, 103))",
                    backgroundSize: "190.35px",
                    scaleX: 1.1,
                    x: width*0.05,
                    transition: {
                        duration: 0.3,
                    }
                }}
            />
        </div>
    )
}
const MenuBar = ({children}) => {
    return (
        <div className={styles.phone_menubar}>
            {children}
        </div>
    )
}
const Button = ({onClick, page, id, icon}) => {
    return (
        <div 
            onClick={onClick}
            className={styles.appicon}
            style={
                page == id ?
                {
                    backgroundColor: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }
                :
                {
                    backgroundColor: "#082438",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }
            }
        >
            {icon}
        </div>
    )
}
const Description = ({text}) => {
    return (
        <motion.div
            style={{
                width: "297px",
                height: "108px",
                position: "absolute",
                bottom: "210px",
                fontWeight: 200
            }}
        >
            {text}
        </motion.div>
    )
}
const InstagramIcon = () => {
    return (
        <img src='instagram.svg'/>
    )
}
const PinterestIcon = () => {
    return (
        <img src='pinterest.svg'/>
    )
}
const RedditIcon = () => {
    return (
        <img src='reddit.svg'/>
    )
}
const TikTokIcon = () => {
    return (
        <img src='tiktok.svg'/>
    )
}

export default Phone;