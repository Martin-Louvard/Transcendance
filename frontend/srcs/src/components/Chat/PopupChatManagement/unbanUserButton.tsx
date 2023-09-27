import { User, ChatChannels } from "../../../Types.ts";
import { useAppDispatch } from "../../../redux/hooks";

const UnbanUserButton = ({ user, chat }: { user: User; chat: ChatChannels }) => {
  const dispatch = useAppDispatch();

  const handleUnban = () => {
    dispatch({type:'UNBAN_USER', payload:[chat.id, user.id]}); 
  };

  return (
    <div className="management-button" onClick={() => handleUnban()}>
      {'UNBAN'}
    </div>
  );
};

export default UnbanUserButton;
