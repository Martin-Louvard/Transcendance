import Footer from "../../components/Footer/Footer";
const About = () => {

    return <>
    <h1>About page</h1> 
    <h2>Website by </h2>
    <ul  className="authors">
    <div className="row">
    <li className="friend-item" >
        <div className='friend-picture'>
            <img src="/martin.jpg"/>
        </div>
        <p>Martin Louvard</p>
    </li>
    <li className="friend-item" >
        <div className='friend-picture'>
            <img src="/default.jpg"/>
        </div>
        <p>Youri Bougre</p>
    </li>
    </div>
    <div className="row">
    <li className="friend-item" >
        <div className='friend-picture'>
            <img src="/default.jpg"/>
        </div>
        <p>Clement Vidon</p>
    </li>
    <li className="friend-item" >
        <div className='friend-picture'>
            <img src="/default.jpg"/>
        </div>
        <p>Darian Sereno</p>
        </li>
        </div>

    </ul>
    <Footer/>
    </>
}
export default About;