import { User } from "../../../Types.ts";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { toast } from "react-hot-toast";
import { IoLogoGameControllerB } from "react-icons/io";

const InviteGameButton = ({ user }: { user: User }) => {
  const currentUser = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();
  const currentFriends = useAppSelector((state) => state.session.friends);

  const handleInviteUser = () => {
    dispatch({
				type: 'WEBSOCKET_SEND_CREATE_AND_INVITE',
				payload: user.id,
			});
  };
  return (
    <div
      className="management-button"
      onClick={() => handleInviteUser()}
    >
      <IoLogoGameControllerB />
    </div>
  );
};
export default InviteGameButton;
