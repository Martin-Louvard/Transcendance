import { User, ChatChannels } from "../../../Types.ts";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { TbCrown, TbCrownOff } from "react-icons/tb";

const AdminAddButton = ({user, chat}: {user:User; chat:ChatChannels}) => {

  const currentUser = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();

  const handleAddAdmin = () => {
    if (currentUser && user){
      if (!chat.admins.includes(user)){
        dispatch({type: 'ADD_ADMIN', payload:[chat.id, user.id]})
      }
      else {
        dispatch({type: 'REMOVE_ADMIN', payload:[chat.id, user.id]})
      }
    }
  };

  return (
    <div className="management-button" onClick={()=> handleAddAdmin()}>
      {chat?.admins.filter((admin) => user.id === admin.id).length > 0 ? <TbCrownOff /> : <TbCrown />}
    </div>
  );
};
export default AdminAddButton;
