import { User, ChatChannels } from "../../../Types.ts";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { BiBlock } from "react-icons/bi";

const BlockUserButton = ({ user } : {user: User}) => {
  const currentUser = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();

  const handleBlockUser = () => {
      dispatch({type: 'BLOCK_USER', payload:[user.id, currentUser?.id]});
  }
  return (
    <div className="management-button" onClick={() => handleBlockUser()}>
      <BiBlock />
    </div>
  );
};
export default BlockUserButton;
