import { User, ChatChannels } from "../../../Types.ts";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { BiBlock } from "react-icons/bi";
import { toast } from "react-hot-toast";

const BlockUserButton = ({ user } : {user: User}) => {
  const currentUser = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();
  const friendship = useAppSelector(
    (state) => state.session.friendships)?.filter(
      (relations) => relations.friend_id === user.id || relations.friend_id === currentUser?.id)[0];

  const handleBlockUser = async () => {
    dispatch({
      type: "WEBSOCKET_SEND_FRIEND_REQUEST",
      payload: [friendship?.id, user.username, 'BLOCKED']})
    toast.success("User Blocked")
  }
  return (
    <div className="management-button" onClick={() => handleBlockUser()}>
      <BiBlock />
    </div>
  );
};
export default BlockUserButton;
