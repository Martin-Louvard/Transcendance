import FriendCard from "./FriendCard"
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import Form from "../Forms/Form";
import { toast } from "react-hot-toast";
import { Friendships, Status } from "../../Types";
import StatusDot from "./StatusDot/StatusDot";

const FriendsListCard: React.FC = () =>{
    const user = useAppSelector((state) => state.session.user);
    const friendships = useAppSelector((state) => state.session.friendships);
    const [friendshipsAccepted, setFriendshipsAccepted] = useState(friendships)
    const [showFriend, setShowFriend] = useState(false)
    const [selectedFriendship, setSelectedFriendship] = useState(Object)
    const [newFriendUsername, setNewFriendUsername] = useState('');
    const dispatch = useAppDispatch();


    useEffect(()=>{
      const accepted = friendships?.filter(f => f.status === Status.ACCEPTED)
      if (accepted)
        setFriendshipsAccepted(accepted)
    },[friendships])

    const sendFriendRequest = async (event: React.FormEvent<HTMLFormElement>) =>{
      event.preventDefault()
      dispatch({ type: 'WEBSOCKET_SEND_FRIEND_REQUEST', payload: [user?.id, newFriendUsername]})
      toast.success("Request Sent")
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.id === 'FriendUsername') {
        setNewFriendUsername(event.target.value);
      }
    };
  
    const displayFriendProfile = (friendship: Friendships) => {
      setShowFriend(true);
      setSelectedFriendship(friendship);
    };

    const friendList = () =>{
      return (
      <div className="friends-card-wrapper">
        <Form onSubmit={sendFriendRequest} title="Add a new friend" buttonText="Add">
          <div>
            <input 
            type="FriendUsername" 
            id="FriendUsername" 
            placeholder="Friend's username" 
            value={newFriendUsername} 
            onChange={handleChange}
            />
          </div>
        </Form>
        <h2>My Friends</h2>
        <ul className="friend-list">
          {friendshipsAccepted
            ? friendshipsAccepted.map((friendship, index) => (
              <li className="friend-item" onClick={() => displayFriendProfile(friendship)} key={index}>
                <div className='friend-picture'>
                  <img 
                    src={friendship.friend_id == user?.id ? friendship.user.avatar:friendship.friend.avatar}
                  />
                </div>
                <p>{friendship.friend_id == user?.id ? friendship.user.username:friendship.friend.username}</p>
                <StatusDot status={friendship.friend_id == user?.id ? friendship.user.status:friendship.friend.status}/>
              </li>
            )) 
          : null}
        </ul>
      </div>
      )
    }

  return (
    <>
        {showFriend ? (
          <FriendCard friendship={selectedFriendship}/>
        ) : (
          friendList()
        )}
    </>
  );
};

export default FriendsListCard