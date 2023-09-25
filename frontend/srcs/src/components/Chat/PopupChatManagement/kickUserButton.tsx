import { useAppDispatch } from "../../../redux/hooks";
import { User, ChatChannels } from "../../../Types.ts";
import { GiBootKick } from "react-icons/gi";
import { useState } from "react";
import { Popup } from 'reactjs-popup';

const KickUserButton = ({ user, chat }:{
  user: User; 
  chat: ChatChannels;
  }) => {
    const dispatch = useAppDispatch();
    const [isClicked, setIsClicked] = useState<boolean>(false);


    const handleKickButton = () => {
      if (isClicked) {
        setIsClicked(false);
      }
      else {
        setIsClicked(true);
      }
    };

    const handleKick = (time: number) => {
      dispatch({type:'KICK_USER', payload:[chat.id, user.id]})
    }

    const handleBan = () => {
      dispatch({type:'BAN_USER', payload:[chat.id, user.id]});
    }


  return (
  <Popup 
    trigger={
      <div className="management-button" onClick={() => handleKickButton()}>
        <GiBootKick />
      </div>
    }
    position="top center"
    closeOnDocumentClick={true}
    onClose={() => setIsClicked(false)}
    nested>
    <div className="chrono-for-action" onClick={() => handleKick(5)}>{"5min"}</div>
    <div className="chrono-for-action" onClick={() => handleKick(10)}>{"10min"}</div>
    <div className="chrono-for-action" onClick={() => handleKick(20)}>{"20min"}</div>
    <div className="chrono-for-action" onClick={() => handleKick(30)}>{"30min"}</div>
    <div className="chrono-for-action" onClick={() => handleBan()}>{"Ban"}</div>

  </Popup>
  );

};
export default KickUserButton;
