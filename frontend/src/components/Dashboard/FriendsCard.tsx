import ProfileCard from "./ProfileCard";
import { useState } from "react";

const FriendsCard = () =>{
    const friends = [
        { username: 'John Doe', email: 'johndoe@example.com', password: 'password123' },
        { username: 'Jane Smith', email: 'janesmith@example.com', password: 'p@ssw0rd' },
        { username: 'Michael Johnson', email: 'michaeljohnson@example.com', password: 'securepass' },
        { username: 'Emily Davis', email: 'emilydavis@example.com', password: 'pass1234' },
        { username: 'David Wilson', email: 'davidwilson@example.com', password: 'strongpassword' },
        { username: 'John Doe', email: 'johndoe@example.com', password: 'password123' },
        { username: 'Jane Smith', email: 'janesmith@example.com', password: 'p@ssw0rd' },
        { username: 'Michael Johnson', email: 'michaeljohnson@example.com', password: 'securepass' },
        { username: 'Emily Davis', email: 'emilydavis@example.com', password: 'pass1234' },
        { username: 'David Wilson', email: 'davidwilson@example.com', password: 'strongpassword' }
      ];
    

    const [showFriend, setShowFriend] = useState(false)
    const [selectedFriend, setSelectedFriend] = useState()

    const displayFriendProfile = (user) =>{
      setShowFriend(true)
      setSelectedFriend(user)
    }

    const friendList = () =>{
      return <div className="friends-card-wrapper">
      <h2>Friends List</h2>
        <ul className="friend-list">
          {friends.map((friend, index) => (
            <li className="friend-item" onClick={() => displayFriendProfile(friend)} key={index}>
            <div className='friend-picture'>
                <img src='./default.jpg'/>
            </div>
              <p>{friend.username}</p>
            </li>
          ))}
        </ul>
        </div>
    }


  return (
    <>

        {
          showFriend ? <ProfileCard {...selectedFriend}/> : friendList()
        }

    </>
  );
};

export default FriendsCard