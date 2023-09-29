import { useNavigate } from "react-router-dom";
import { User } from "../../../Types.ts";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { toast } from "react-hot-toast";
import { IoLogoGameControllerB } from "react-icons/io";
import { LobbySlotCli } from "@shared/class.ts";
import { useEffect, useState } from "react";

export function isPlayerInGame(slots: LobbySlotCli[], user: User): Boolean {
  let isInGame = false;
  slots.forEach((slot) => {
    if (slot.player?.id == user.id)
      isInGame = true;
  })
  return isInGame
}

const InviteGameButton = ({ user }: { user: User }) => {
  const currentUser = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();
  const currentFriends = useAppSelector((state) => state.session.friends);
  const navigate = useNavigate();
  const slots = useAppSelector(state => state.websocket.lobbySlots);
  const [isInGame, setIsInGame] = useState<Boolean>(false)

  const handleInviteUser = () => {
    if (!isInGame) {
      dispatch({
          type: 'WEBSOCKET_SEND_CREATE_AND_INVITE',
          payload: user.id,
        });
        navigate('/');
    }
  };

  useEffect(() => {
    setIsInGame(isPlayerInGame(slots, user));
  }, [slots]);

  return (
    <div
      className={ !isPlayerInGame(slots, user) ? "management-button" : "disabled"}
      onClick={() => handleInviteUser()}
    >
      <IoLogoGameControllerB />
    </div>
  );
};
export default InviteGameButton;
