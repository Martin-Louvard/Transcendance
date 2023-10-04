import React from "react";
import Footer from "../../components/Footer/Footer";

const About: React.FC = () => {

    return <>
    <div className="about-wrapper">
    <h2>Website by </h2>
    <ul  className="authors">
    <div className="row">
    <li className="item" >
        <a href="https://github.com/Martin-Louvard">
        <div className='friend-picture'>
            <img src="/martin.jpg"/>
        </div>
        <p>Martin Louvard</p>
        </a>
    </li>
    <li className="item" >
        <a href="https://github.com/Youkass">
        <div className='friend-picture'>
            <img src="/youri.jpg"/>
        </div>
        <p>Youri Bougre</p>
        </a>
    </li>
    </div>
    <div className="row">
    <li className="item" >
        <a href="https://github.com/clemedon">
        <div className='friend-picture'>
            <img src="/default.jpg"/>
        </div>
        <p>Clement Vidon</p>
        </a>
    </li>
    <li className="item" >
        <a  href="https://github.com/dariansereno">
        <div className='friend-picture'>
            <img src="/darian.jpg"/>
        </div>
        <p>Darian Sereno</p>
        </a>
        </li>
        </div>

    </ul>
    </div>
    <Footer/>
    </>
}
export default About;