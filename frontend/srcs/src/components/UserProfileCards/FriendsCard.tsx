import ProfileCard from "./ProfileCard";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import Form from "../Forms/Form";
import { toast } from "react-hot-toast";
import { setSessionUser } from "../../redux/sessionSlice";

const FriendsCard = () =>{
    const user = useAppSelector((state) => state.session.user);
    const friends = useAppSelector((state) => state.session.friends);
    const [showFriend, setShowFriend] = useState(false)
    const [selectedFriend, setSelectedFriend] = useState(Object)
    const [newFriendUsername, setNewFriendUsername] = useState('');
    const dispatch = useAppDispatch();

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
          dispatch(setSessionUser(result));
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