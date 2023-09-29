import { User, ChatChannels, ContentOptions } from "../../../Types.ts";
import { useAppSelector } from "../../../redux/hooks";
import AddUserButton from "./addUserButton.tsx";
import AdminAddButton from "./addAdminButton.tsx";
import { GiImperialCrown } from "react-icons/gi";
import KickUserButton from "./kickUserButton.tsx";
import StatusDot from "../../UserProfileCards/StatusDot.tsx";
import BlockUserButton from "./blockUserButton.tsx";
import { useAppDispatch } from "../../../redux/hooks";
import MuteUserButton from "./muteUserButton.tsx";
import {
  setContentToShow,
  setFriendProfile,
} from "../../../redux/sessionSlice.ts";
import { useNavigate } from "react-router-dom";
import InviteGameButton from "./inviteToGameButton.tsx";
import { RiVipCrownFill } from "react-icons/ri";

const UserListItem = ({ user, chat, setIsOpen }: { user: User; chat: ChatChannels, setIsOpen:React.Dispatch<React.SetStateAction<boolean>> }) => {
  const currentUser = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const goToUserProfile = (user: User) => {
    dispatch(setFriendProfile(user));
    navigate("/friends/friendprofile");
  };

  const displayRights = () => {
    if (chat.owner.id === user.id && chat.channelType !== 'private-message')
      return (<GiImperialCrown />)
    else if (chat.owner.id !== user.id && chat.channelType !== 'private-message'
      && chat?.admins.filter((admin) => admin.id === user.id).length)
      return (<RiVipCrownFill />)
    else
      return("");
  };

  return (
    <div className="popup-user-list-item">
      <div
        className="popup-user-list-item link-to-user"
        onClick={() => {
          goToUserProfile(user);
          setIsOpen(false);
        }}
      >
        <div className="picture-indicator">
          <img
            className="popup-profile-pic"
            src={"http://localhost:3001/users/avatar/" + user.username + "/" + user.avatar.split("/").reverse()[0]}
          />
          <StatusDot status={user.status} style={"position-popup"} />
        </div>
        <div className="management-chat-user-list-username">
          {user.username}
          {displayRights()}
        </div>
      </div>
      { chat.channelType !== 'private-message' ? (
        <>
          <AddUserButton user={user} />
          <div>
            {chat?.owner.id === currentUser?.id ? (
              <AdminAddButton user={user} chat={chat} />
              ) : (
                ""
              )}
            </div>
            <div>
              {chat?.admins.filter((admin) => admin.id === currentUser?.id).length && chat?.owner.id !== user.id ? <KickUserButton user={user} chat={chat} /> : ""}{" "}
            </div>
            <div>
              {chat?.admins.filter((admin) => admin.id === currentUser?.id).length && chat?.owner.id !== user.id ? <MuteUserButton chat={chat} user={user} /> : ""}{" "}
            </div>
          </>
      ) : ( " " )}
      <div>
        <InviteGameButton user={user}/>
      </div>
      <div>
        <BlockUserButton chat={chat} user={user} setIsOpen={setIsOpen}/>
      </div>
    </div>
  );
};
export default UserListItem;
