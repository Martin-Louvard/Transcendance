import ProfileCard from "./ProfileCard";
import { useState, useEffect } from "react";
import { useAppSelector } from "../../hooks";

const FriendsCard = () =>{
    const storedFriends = useAppSelector((state) => state.user.friends);
    const [showFriend, setShowFriend] = useState(false)
    const [selectedFriend, setSelectedFriend] = useState(Object)
    const [friends, setFriends] = useState(storedFriends)

    useEffect(() => {
      const fetchFriendsWithInfos = async () => {
        const friendsWithInfos = await Promise.all(
          storedFriends.map(async (item) => {
            const response = await fetch(`http://localhost:3001/users/id/${item.friend_id}?id=${item.friend_id}`);
            const data = await response.json();
            return data;
          })
        );
        console.log(friendsWithInfos);
        setFriends(friendsWithInfos);
      };
    
      fetchFriendsWithInfos();
    }, [storedFriends]);


    const displayFriendProfile = (userFriend: object) =>{
      setShowFriend(true)
      setSelectedFriend(userFriend)
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