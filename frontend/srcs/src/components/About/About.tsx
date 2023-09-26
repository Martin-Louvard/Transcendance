import React from "react";
import Footer from "../../components/Footer/Footer";

const About: React.FC = () => {

    return <>
    <div className="about-wrapper">
    <h2>Website by </h2>
    <ul  className="authors">
    <div className="row">
    <li className="item" >
        <div className='friend-picture'>
            <img src="/martin.jpg"/>
        </div>
        <p>Martin Louvard</p>
    </li>
    <li className="item" >
        <div className='friend-picture'>
            <img src="/default.jpg"/>
        </div>
        <p>Youri Bougre</p>
    </li>
    </div>
    <div className="row">
    <li className="item" >
        <div className='friend-picture'>
            <img src="/default.jpg"/>
        </div>
        <p>Clement Vidon</p>
    </li>
    <li className="item" >
        <div className='friend-picture'>
            <img src="/default.jpg"/>
        </div>
        <p>Darian Sereno</p>
        </li>
        </div>

    </ul>
    </div>
    <Footer/>
    </>
}
export default About;