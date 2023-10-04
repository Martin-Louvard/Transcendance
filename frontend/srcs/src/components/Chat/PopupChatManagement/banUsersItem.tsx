
import { User, ChatChannels } from "../../../Types.ts";
import { useAppSelector } from "../../../redux/hooks";
import UnbanUserButton from "./unbanUserButton.tsx";

const BanUserItem = ({ user, chat }: { user: User; chat: ChatChannels }) => {
  const currentUser = useAppSelector((state) => state.session.user);

  return (
    <div className="popup-user-list-item">
      <div
        className="popup-user-list-item link-to-user">
        <div className="picture-indicator">
          <img
            className="popup-profile-pic"
            src={
              "http://${process.env.IP}/users/avatar/" +
              user.username +
              "/" +
              user.avatar.split("/").reverse()[0]
            }
          />
        </div>
        <div className="management-chat-user-list-username">
          {user.username}
        </div>
      </div>
      <div>
        {(chat.owner.id === currentUser?.id 
          || chat.admins.filter((admin) => admin.id === currentUser?.id).length) ? 
          <UnbanUserButton user={user} chat={chat}/> : "" }
      </div>
    </div>
  );
};
export default BanUserItem;
