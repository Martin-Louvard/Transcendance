import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import Chat from '../Chat/Chat';
import HistoryCard from './HistoryCard';
import { Friendships, Status } from '../../Types';

interface FriendCardProps {
  friendship: Friendships;
}

const FriendCard: React.FC<FriendCardProps> = ({ friendship }) => {
  const user = useAppSelector((state) => state.session.user);
  const friend = friendship.friend_id === user?.id ? friendship.user : friendship.friend;
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [showGames, setShowGames] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const deleteFriendship = async () => {
     dispatch({ type: 'WEBSOCKET_SEND_FRIEND_REQUEST', payload: [friendship.id, friendship.friend_id == user?.id ? friendship.user.username:friendship.friend.username, Status.DECLINED] })
  };

  const options = () =>{
    if (friendship.status === Status.ACCEPTED){
      return(<>
        <button onClick={() => setChatOpen(true)}>Open Private Chat</button>
        <button onClick={() => deleteFriendship()}>Delete From Friends</button>
      </>
      )
    }
  }

  const Profile: React.FC = () => {
    return (
      <>
        <div className="profile-picture">
          <img src={friend.avatar} alt={`${friend.username}'s Avatar`} />
        </div>

        <div className="user-info">
          <h6>Username: {friend.username}</h6>
          <h6>Email: {friend.email}</h6>
        </div>
        <button onClick={() => setShowGames(true)}>Game History</button>
        {options()}
      </>
    );
  };

  return (
    <div className="profile-card-wrapper">
      {chatOpen ? <Chat chatId={friendship.chat_id} /> : showGames ? <HistoryCard /> : <Profile/>}
    </div>
  );
};

export default FriendCard;
