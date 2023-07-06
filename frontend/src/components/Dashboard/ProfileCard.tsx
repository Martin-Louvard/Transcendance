import './Dashboard.css'
import { useAppSelector } from "../../hooks";


const ProfileCard = () =>{
    const user = useAppSelector((state) => state.user);

    return <>
        <div className="profile-card-wrapper">
            <div className='profile-picture'>
                <img src='./default.jpg'/>
            </div>
            <div className='user-info'>
                <h6> Email: {user.email}</h6>
                <h6>Password: {user.password}</h6>
            </div>
        </div>
    </>
}

export default ProfileCard