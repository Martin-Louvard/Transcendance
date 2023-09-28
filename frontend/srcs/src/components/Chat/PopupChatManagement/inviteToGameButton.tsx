import { User } from "../../../Types.ts";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { toast } from "react-hot-toast";
import { IoLogoGameControllerB } from "react-icons/io";

const InviteGameButton = ({ user }: { user: User }) => {
  const currentUser = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();
  const currentFriends = useAppSelector((state) => state.session.friends);

  const handleInviteUser = () => {
    dispatch();
  };
  return (
    <div
      className="management-add-user-button"
      onClick={() => handleInviteUser()}
    >
      <IoLogoGameControllerB />
    </div>
  );
};
export default InviteGameButton;
