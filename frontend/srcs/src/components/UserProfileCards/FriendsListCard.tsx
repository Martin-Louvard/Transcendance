import FriendCard from "./FriendCard"
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import Form from "../Forms/Form";
import { toast } from "react-hot-toast";
import { Friendships, Status } from "../../Types";
import StatusDot from "./StatusDot";
import { deleteInvitedGame, setContentToShow, setLobbyType, setParams } from "../../redux/websocketSlice";
import { GameRequest, LobbyType } from "@shared/class";
import { Avatar } from "@mui/material";

const FriendsListCard: React.FC = (props) =>{
    const user = useAppSelector((state) => state.session.user);
    const friendships = useAppSelector((state) => state.session.friendships);
    const [friendshipsAccepted, setFriendshipsAccepted] = useState(friendships)
    const [showFriend, setShowFriend] = useState(false)
    const [selectedFriendship, setSelectedFriendship] = useState(Object)
    const [newFriendUsername, setNewFriendUsername] = useState('');
    const dispatch = useAppDispatch();
    const [friendRequests, setFriendRequest] = useState<Friendships[] | undefined>(friendships);
    const gameRequest= useAppSelector((state) => state.websocket.invitedGames)

    useEffect(()=>{
      if (friendships){
        setFriendRequest(friendships.filter(f => (f.status === Status.PENDING && f.sender_id != user?.id)))
      }
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

    const renderNotifications = () => (   
      <div className="friends-card-wrapper">
        <h2>Friend Requests</h2>
            <ul className="list">
              {friendRequests ? friendRequests.map((friendship, index) => (
                <li className="item" key={index}>
                  <Avatar onClick={()=>{setSelectedFriendship(friendship); dispatch(setContentToShow("friendUser")) }} sx={{width:'60px', height:"60px"}} src={friendship.friend_id == user?.id ? friendship.user.avatar: friendship.friend.avatar}/>
                <div>
                  <p>{friendship.friend_id == user?.id ? friendship.user.username:friendship.friend.username}</p>
                  <div className='accept-deny'>
                    <button onClick={()=>{ dispatch({ type: 'WEBSOCKET_SEND_FRIEND_REQUEST', payload: [friendship.id, friendship.friend_id == user?.id  ? friendship.user.username:friendship.friend.username, Status.ACCEPTED] }) }}>Add Friend ✅</button>
                    <button onClick={()=>{ dispatch({ type: 'WEBSOCKET_SEND_FRIEND_REQUEST', payload: [friendship.id,friendship.friend_id == user?.id  ? friendship.user.username:friendship.friend.username, Status.DECLINED] }) }}>Decline ❌</button>
                  </div>
                </div>
                </li>
              )) : <></>}
            </ul>
        </div>
      )
    
      const renderGameRequests = () => (
        
        <div className="friends-card-wrapper">
          <h2>Game Requests</h2>
              <ul className="list">
                {gameRequest ? gameRequest.map((request, index, requests) => (
                  <li className="item" key={index}>
                    <Avatar src={request.sender.avatar} sx={{width:"60px", height:"60px"}}/>
                  <div>
                    <p>{request.sender.username}</p>
                    <div className='accept-deny'>
                      <button onClick={() => {joinLobby(request)}} >Join Game ✅</button>
                      <button onClick={() => {dispatch({
                        type: "WEBSOCKET_SEND_DELETE_GAME_INVITATION",
                        payload: request,
                      })}}>Decline ❌</button>
                    </div>
                  </div>
                  </li>
                )) : <></>}
              </ul>
          </div>
        )
    

        useEffect(()=>{
    if (friendships){
      let friendshipstmp: Friendships[] = [];
      friendships.forEach((e) => {
        if (e.status === Status.PENDING && e.sender_id != user?.id)
          friendshipstmp.push(e);
      })
      setFriendRequest(friendshipstmp);
    }
  }, [friendships])


  function joinLobby(request: GameRequest) {
    dispatch(setLobbyType(LobbyType.create));
    dispatch({
      type: "WEBSOCKET_SEND_JOIN_LOBBY",
      payload: {lobbyId: request.lobby.id, info: {username: user?.username, avatar: user?.avatar, id: user?.id}},
    })
    dispatch({
      type: "WEBSOCKET_SEND_DELETE_GAME_INVITATION",
      payload: request,
    })
    if (!request.lobby.params)
      return ;
    dispatch(setContentToShow('lobby'));
    dispatch(setParams(request.lobby.params));
  }

    const friendList = () =>{
      return (
      <div className="card-wrapper">
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
        {friendRequests?.length ? renderNotifications() : ""}
        {gameRequest?.length  ? renderGameRequests() : ""}
        <h2>My Friends</h2>
        <ul className="list">
          {friendshipsAccepted
            ? friendshipsAccepted.map((friendship, index) => (
              <li className="item" onClick={() => displayFriendProfile(friendship)} key={index}>
                <div className="picture-indicator">
                  <div className='friend-picture'>
                    <img 
                      src={friendship.friend_id == user?.id ? friendship.user.avatar:friendship.friend.avatar}
                    />
                  </div>
                  <StatusDot status={friendship.friend_id == user?.id ? friendship.user.status:friendship.friend.status}/>
                </div>
                <p>{friendship.friend_id == user?.id ? friendship.user.username:friendship.friend.username}</p>
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