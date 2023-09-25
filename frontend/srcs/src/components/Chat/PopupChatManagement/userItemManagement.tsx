import { User, ChatChannels, ContentOptions } from "../../../Types.ts";
import { useAppSelector } from "../../../redux/hooks";
import AddUserButton from "./addUserButton.tsx";
import AdminAddButton from "./addAdminButton.tsx";
import { GiImperialCrown } from "react-icons/gi";
import KickUserButton from "./kickUserButton.tsx"
import StatusDot from "../../UserProfileCards/StatusDot.tsx";
import { useAppDispatch } from "../../../redux/hooks";
import { setContentToShow, setFriendProfile } from "../../../redux/sessionSlice.ts";

const UserListItem = ({user, chat}: {user: User; chat: ChatChannels}) => {
  const currentUser = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();

  const isKickable = () => {
    if ((chat?.admins.includes(currentUser!) 
      && !chat?.admins.includes(user)) || (chat?.owner.id === currentUser?.id))
      return true;
    else
      return false;
  };

  const goToUserProfile = (user: User) =>{
    dispatch(setFriendProfile(user))
    dispatch(setContentToShow(ContentOptions.FRIENDPROFILE))
  }

  return (
    <div className="popup-user-list-item">
      <div className="popup-user-list-item link-to-user" onClick={()=>{goToUserProfile(user)}} >
        <div className="picture-indicator">
          <img className="popup-profile-pic" src={ 'http://localhost:3001/users/avatar/' + user.username + '/' +user.avatar.split('/').reverse()[0]} />
          <StatusDot status={user.status} style={"position-popup"}/>
        </div>
        <div className="management-chat-user-list-username">{user.username}
        {chat.owner.id === user.id ? <GiImperialCrown /> : ""}
        </div>
      </div><AddUserButton user={user}/>
      <div>{chat?.owner.id === currentUser?.id ? <AdminAddButton user={user} chat={chat} /> : ""}</div>
      <div>{isKickable() ? <KickUserButton user={user} chat={chat}/> : "" } </div>
    </div>
  );
};
export default UserListItem;
