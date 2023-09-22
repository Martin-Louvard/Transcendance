import { User, ChatChannels } from "../../../Types.ts";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";

const LeaveChatButton = ({chat}: {chat:ChatChannels}) => {
  const currentUser = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();

  const handleLeaveButton = () => {
    if (currentUser) {
      if (chat.Owner.id === currentUser.id) {
        if (chat.Admins.filter((admin) => admin.id !== currentUser.id).length > 0){
          const newOwner = chat.Admins.filter((admin) => admin.id !== currentUser.id)[0];
          dispatch({type:'CHANGE_OWNER', payload:[chat.id, newOwner.id, currentUser.id]})
        }
        else {
          if (chat.participants.filter((user) => user.id !== currentUser.id).length > 0){
            const newOwner = chat.participants.filter((user) => user.id !== currentUser.id)[0];
            dispatch({type:'CHANGE_OWNER', payload:[chat.id, newOwner.id, currentUser.id]})
          }
          else {
            dispatch({type:'DEL_CHAT', payload:[chat.id]});
          }
        }
      }
      else {
        dispatch({type:'LEAVE_CHAT', payload:[chat.id, currentUser.id]});
      }
    }
  };

  return (
    <div className="management-leave-button" onClick={()=> handleLeaveButton()}>
  </div>);
};
export default LeaveChatButton;
