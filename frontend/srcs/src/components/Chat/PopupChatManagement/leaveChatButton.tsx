import { User, ChatChannels } from "../../../Types.ts";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { removeJoinedChatChannel, removeOpenedChatChannel } from "../../../redux/sessionSlice.ts";
import {GiExitDoor} from "react-icons/gi";

const LeaveChatButton = ({chat, setIsOpen}: {chat: ChatChannels; setIsOpen:React.Dispatch<React.SetStateAction<boolean>>} ) => {
  const currentUser = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();

  const handleLeaveButton = () => {
    if (currentUser) {
      if (chat.owner.id === currentUser.id) {
        if (chat.admins.filter((admin) => admin.id !== currentUser.id).length > 0){
          const newOwner = chat.admins.filter((admin) => admin.id !== currentUser.id)[0];
          dispatch({type:'CHANGE_OWNER', payload:[chat.id, newOwner.id, currentUser.id]})
        }
        else {
          if (chat.participants.filter((user) => user.id !== currentUser.id).length > 0){
            const newOwner = chat.participants.filter((user) => user.id !== currentUser.id)[0];
            dispatch({type:'CHANGE_OWNER', payload:[chat.id, newOwner.id, currentUser.id]})
          }
          else if (chat.participants.length === 1){
            dispatch({type:'DEL_CHAT', payload:[chat.id]});
          }
        }
      }
      else {
        if (chat.participants.length === 1){
          dispatch({type:'DEL_CHAT', payload:[chat.id]});
        }
        else{
          dispatch({type:'LEAVE_CHAT', payload:[chat.id, currentUser.id]});
        }
      }
      setIsOpen(false);
      dispatch(removeOpenedChatChannel(chat.id));
      dispatch(removeJoinedChatChannel(chat.id));
    }
  };

  return (
    <div className="management-leave-button" onClick={()=> handleLeaveButton()}>
      <p>LEAVE CHAT</p><GiExitDoor />
  </div>);
};
export default LeaveChatButton;
