import { User } from "../../../Types.ts";
import { BsPersonAdd } from "react-icons/bs";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { toast } from "react-hot-toast";


const AddUserButton = ({user}: {user:User}) => {
  const currentUser = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();
  const currentFriends = useAppSelector((state) => state.session.friends);

  const sendFriendRequest = async () => {
    dispatch({ type: 'WEBSOCKET_SEND_FRIEND_REQUEST', payload: [currentUser?.id, user?.username]})
    toast.success("Request Sent")
}

  const handleAddUser = (user: User) => {

    if (currentUser && user){
      if (currentFriends && currentFriends.filter((f) => f.id === user.id).length > 0){
          return ;
      }
      else {
        sendFriendRequest();
      }
    }
  };
  return (
    <div className="management-button" onClick={()=> handleAddUser(user)}>
      <BsPersonAdd />
    </div>
  );
};
export default AddUserButton;
