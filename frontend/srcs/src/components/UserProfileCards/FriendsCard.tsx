import ProfileCard from "./ProfileCard";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import Form from "../Forms/Form";
import { setUser } from "../../redux/userReducer";
import { toast } from "react-hot-toast";

const FriendsCard = () =>{
    const storedFriendsList = useAppSelector((state) => state.user.friends);
    const user = useAppSelector((state) => state.user);
    const [showFriend, setShowFriend] = useState(false)
    const [selectedFriend, setSelectedFriend] = useState(Object)
    const [friends, setFriends] = useState(storedFriendsList)
    const [newFriendUsername, setNewFriendUsername] = useState('');
    const dispatch = useAppDispatch();

    
    useEffect(() => {
      const fetchFriendsWithInfos = async () => {
        const friendsWithInfos = await Promise.all(
          storedFriendsList.map(async (item) => {
            let response;
            if (item.friend_id !== user.id)
              response = await fetch(`http://localhost:3001/users/id/${item.friend_id}?id=${item.friend_id}`);
            else
              response = await fetch(`http://localhost:3001/users/id/${item.user_id}?id=${item.user_id}`);
            const data = await response.json();
            return data;
          })
        );
        setFriends(friendsWithInfos);
      };
    
      fetchFriendsWithInfos();
    }, [storedFriendsList]);



    const updateFriend = async (event: React.FormEvent<HTMLFormElement>) =>{
      event.preventDefault();
      const requestOptions = {
        method: 'POST',
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
          dispatch(setUser({...result, access_token: user.access_token}));
        }
        else if (response.status === 404 || response.status === 406)
          toast.error(response.statusText)
      }catch(err) {
        console.log(err);
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
      <Form onSubmit={updateFriend} title="Add a new friend" buttonText="Add">
      <div>
        <input type="FriendUsername" id="FriendUsername" placeholder="Friend's username" value={newFriendUsername} onChange={handleChange} />
      </div>
      </Form>
      <h2>My Friends</h2>
        <ul className="friend-list">
          {friends ? friends.map((friend, index) => (
            <li className="friend-item" onClick={() => displayFriendProfile(friend)} key={index}>
            <div className='friend-picture'>
              <img src={friend.avatar}/>
            </div>
              <p>{friend.username}</p>
            </li>
          )) : <></>}

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