import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import Chat from '../Chat/Chat';
import HistoryCard from './HistoryCard';
import { User, Status, Friendships } from '../../Types';
import { toast } from "react-hot-toast";
import { addOpenedChatChannel, setJoinedChatChannels } from '../../redux/sessionSlice';

interface FriendCardProps {
  userToDisplay: User;
}

const FriendCard: React.FC<FriendCardProps> = ({ userToDisplay }) => {
  const user = useAppSelector((state) => state.session.user);
  const [friendship, setFriendship] = useState<Friendships>();
  const friendships = useAppSelector((state)=> state.session.friendships);
  const joinedChatChannels = useAppSelector((state) => state.session.JoinedChatChannels)
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [showGames, setShowGames] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(()=>{
    const friendshipExists = friendships?.find((f) => {
     return userToDisplay.id === f.user_id || userToDisplay.id === f.friend_id
    })
    setFriendship(friendshipExists)
  },[userToDisplay]) 

  const deleteFriendship = async () => {
     dispatch({ type: 'WEBSOCKET_SEND_FRIEND_REQUEST', payload: [friendship?.id, friendship?.friend_id == user?.id ? friendship?.user.username:friendship?.friend.username, Status.CANCELED] })
     toast.success("User Removed From Friends")
  };

  const blockFriendship = async () => {
    dispatch({type: "WEBSOCKET_SEND_FRIEND_REQUEST", payload: [friendship?.id, friendship?.friend_id == user?.id ? friendship?.user.username:friendship?.friend.username, Status.BLOCKED] })
    toast.success("User Blocked")
  }

  const sendFriendRequest = async () => {
    dispatch({ type: 'WEBSOCKET_SEND_FRIEND_REQUEST', payload: [user?.id, userToDisplay?.username]})
    toast.success("Request Sent")
}

  const options = () =>{
    if (friendship?.status === Status.ACCEPTED){
      return(<>
        <button onClick={() => {if(friendship.chat_id){dispatch(addOpenedChatChannel(joinedChatChannels.filter(c =>c.id ==- friendship.chat_id)))}}}>Open Private Chat</button>
        <button onClick={() => deleteFriendship()}>Delete From Friends</button>
        <button onClick={() => blockFriendship()}>Block From Friends</button>
      </>
      )
    }
    else if (friendship === undefined){
      return(<>
        <button onClick={() => sendFriendRequest()}>Add Friend</button>
      </>
      )
    }
  }

  const Profile: React.FC = () => {
    return (
      <>
        <div className="profile-picture" style={{marginTop:"10vh"}}>
          <img src={userToDisplay.avatar} alt={`${userToDisplay.username}'s Avatar`} />
        </div>

        <div className='user-info'>
          <h3> {userToDisplay.username} </h3>
          <h6> {userToDisplay.rank} </h6>
          <h6> Victories:{userToDisplay.victoriesCount} </h6>
          <h6> Defeats:{userToDisplay.defeatCount} </h6>
      </div>
      <div className='list'>
        <button onClick={() => setShowGames(true)}>Game History</button>
        {options()}
        </div>
      </>
    );
  };

  return (
    <div className="card-wrapper">
      { showGames ? <HistoryCard user={userToDisplay}/> : <Profile/>}
    </div>
  );
};

export default FriendCard;
