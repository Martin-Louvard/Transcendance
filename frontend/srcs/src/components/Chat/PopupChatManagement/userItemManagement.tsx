import { User, ChatChannels } from "../../../Types.ts";
import { useAppSelector } from "../../../redux/hooks";
import AddUserButton from "./addUserButton.tsx";
import AdminAddButton from "./addAdminButton.tsx";
import { GiImperialCrown } from "react-icons/gi";
import KickUserButton from "./kickUserButton.tsx"


const UserListItem = ({user, chat}: {user: User; chat: ChatChannels}) => {
  const currentUser = useAppSelector((state) => state.session.user);

  const isKickable = () => {
    if ((chat?.admins.includes(currentUser!) 
      && !chat?.admins.includes(user)) || (chat?.owner.id === currentUser?.id))
      return true;
    else
      return false;
  };
  return (
    <>
      <div className="management-chat-user-list-username">{user.username}
      {chat.owner.id === user.id ? <GiImperialCrown /> : ""}
      </div>
      <div></div>
      <div><AddUserButton user={user}/></div>
      <div>{chat?.owner.id === currentUser?.id ? <AdminAddButton user={user} chat={chat} /> : ""}</div>
      <div>{isKickable() ? <KickUserButton user={user} chat={chat}/> : "" } </div>
    </>
  );
};
export default UserListItem;
