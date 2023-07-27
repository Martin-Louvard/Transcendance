import ProfileCard from "./ProfileCard";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import Form from "../Authentication/Form";
import { setUser } from "../Authentication/userReducer";

const FriendsCard = () =>{
    const storedFriends = useAppSelector((state) => state.user.friends);
    const user = useAppSelector((state) => state.user);
    const [showFriend, setShowFriend] = useState(false)
    const [selectedFriend, setSelectedFriend] = useState(Object)
    const [friends, setFriends] = useState(storedFriends)
    const [newFriendUsername, setNewFriendUsername] = useState('');
    const dispatch = useAppDispatch();

    
    useEffect(() => {
      const fetchFriendsWithInfos = async () => {
        const friendsWithInfos = await Promise.all(
          storedFriends.map(async (item) => {
            const response = await fetch(`http://localhost:3001/users/id/${item.friend_id}?id=${item.friend_id}`);
            const data = await response.json();
            return data;
          })
        );
        setFriends(friendsWithInfos);
      };
    
      fetchFriendsWithInfos();
    }, [storedFriends]);

    const addFriend = async (event: React.FormEvent<HTMLFormElement>) =>{
      event.preventDefault();
      if (newFriendUsername == user.username)
      {
        alert("you can't add yourself")
        return;
      }
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          friend_username: newFriendUsername
         })
      };

      try{
        const response = await fetch(`http://localhost:3001/users/${user.username}/friends`, requestOptions)
        if (response.ok)
        {
          const result = await response.json()
          const isLoggedIn = true
          dispatch(setUser({...result, isLoggedIn}));
        }
        else if (response.status === 404)
          alert("User not found")
      }catch(err) {
        console.log("coucou de erreur")

        alert(err);
      }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.id === "FriendUsername" ? setNewFriendUsername(event.target.value): 
       ()=>{}
     };

    const displayFriendProfile = (userFriend: object) =>{
      setShowFriend(true)
      setSelectedFriend(userFriend)
    }

    const friendList = () =>{
      return <div className="friends-card-wrapper">
      <Form onSubmit={addFriend} title="Add a new friend" buttonText="Add">
      <div>
        <input type="FriendUsername" id="FriendUsername" placeholder="Friend's username" value={newFriendUsername} onChange={handleChange} />
      </div>
      </Form>
      <h2>My Friends</h2>
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