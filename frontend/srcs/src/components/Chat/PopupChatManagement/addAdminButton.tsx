import { User, ChatChannels } from "../../../Types.ts";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { TbCrown, TbCrownOff } from "react-icons/tb";

const AdminAddButton = ({user, chat}: {user:User; chat:ChatChannels}) => {

  const currentUser = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();

  const handleAddAdmin = () => {
    if (currentUser && user){
      if (!chat.Admins.includes(user)){
        dispatch({type: 'ADD_ADMIN', payload:[chat.id, user.id]})
      }
      else {
        dispatch({type: 'REMOVE_ADMIN', payload:[chat.id, user.id]})
      }
    }
  };

  return (
    <div className="management-add-admin-button" onClick={()=> handleAddAdmin()}>
      {chat?.Admins.includes(user) ? <TbCrownOff /> : <TbCrown />}
    </div>
  );
};
export default AdminAddButton;
