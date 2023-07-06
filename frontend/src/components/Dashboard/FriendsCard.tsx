import ProfileCard from "./ProfileCard";
import { useState } from "react";

const FriendsCard = () =>{
    const friends = [
        { name: 'John Doe', email: 'johndoe@example.com', password: 'password123' },
        { name: 'Jane Smith', email: 'janesmith@example.com', password: 'p@ssw0rd' },
        { name: 'Michael Johnson', email: 'michaeljohnson@example.com', password: 'securepass' },
        { name: 'Emily Davis', email: 'emilydavis@example.com', password: 'pass1234' },
        { name: 'David Wilson', email: 'davidwilson@example.com', password: 'strongpassword' },
        { name: 'John Doe', email: 'johndoe@example.com', password: 'password123' },
        { name: 'Jane Smith', email: 'janesmith@example.com', password: 'p@ssw0rd' },
        { name: 'Michael Johnson', email: 'michaeljohnson@example.com', password: 'securepass' },
        { name: 'Emily Davis', email: 'emilydavis@example.com', password: 'pass1234' },
        { name: 'David Wilson', email: 'davidwilson@example.com', password: 'strongpassword' }
      ];
    

    const [showFriend, setShowFriend] = useState(false)

    const displayFriendProfile = () =>{
      setShowFriend(true)
    }

    const friendList = () =>{
      return <div className="friends-card-wrapper">
      <h2>Friends List</h2>
        <ul className="friend-list">
          {friends.map((friend, index) => (
            <li className="friend-item" onClick={displayFriendProfile} key={index}>
            <div className='friend-picture'>
                <img src='./default.jpg'/>
            </div>
              <p>{friend.name}</p>
            </li>
          ))}
        </ul>
        </div>
    }


  return (
    <>

        {
          showFriend ? <ProfileCard/> : friendList()
        }

    </>
  );
};

export default FriendsCard