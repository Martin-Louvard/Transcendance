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

const UserListItem = ({ user, chat, setIsOpen }: { user: User; chat: ChatChannels, setIsOpen:React.Dispatch<React.SetStateAction<boolean>> }) => {
  const currentUser = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isKickable = () => {
    if (
      (chat?.admins.includes(currentUser!) && !chat?.admins.includes(user)) ||
      chat?.owner.id === currentUser?.id
    )
      return true;
    else return false;
  };

  const goToUserProfile = (user: User) => {
    dispatch(setFriendProfile(user));
    navigate("/friends/friendprofile");
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
          {chat.owner.id === user.id && chat.channelType !== 'private-message'? <GiImperialCrown /> : ""}
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
              {isKickable() ? <KickUserButton user={user} chat={chat} /> : ""}{" "}
            </div>
            <div>
              {isKickable() ? <MuteUserButton chat={chat} user={user} /> : ""}{" "}
            </div>
          </>
      ) : ( " " )}
      <div>
        <BlockUserButton user={user} />
      </div>
    </div>
  );
};
export default UserListItem;
