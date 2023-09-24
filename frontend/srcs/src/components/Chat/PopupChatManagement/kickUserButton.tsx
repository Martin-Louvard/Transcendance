import { useAppDispatch } from "../../../redux/hooks";
import { User, ChatChannels } from "../../../Types.ts";
import { GiBootKick } from "react-icons/gi";

const KickUserButton = ({ user, chat }:{user: User; chat: ChatChannels}) => {
  const dispatch = useAppDispatch();

  const handleKickButton = () => {
    dispatch({type:'KICK_USER', payload:[chat.id, user.id]})
  };

  return (
    <div className="management-kick-button" onClick={() => handleKickButton()}>
      <GiBootKick />
    </div>
  );

};
export default KickUserButton;
