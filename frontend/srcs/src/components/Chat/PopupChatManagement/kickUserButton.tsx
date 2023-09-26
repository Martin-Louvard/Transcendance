import { useAppDispatch } from "../../../redux/hooks";
import { User, ChatChannels } from "../../../Types.ts";
import { GiBootKick } from "react-icons/gi";
import { useState } from "react";
import { Popup } from 'reactjs-popup';


let contentStyle = { width:"fit-content", background: 'transparent', border: "none"};

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
    nested
    {...{contentStyle}}>
      <div className="chat-popup popup-ban" >
    <button className="chrono-for-action" onClick={() => handleBan()}>{"BAN"}</button>
    <button className="chrono-for-action" onClick={() => handleKick(10)}>{"KICK"}</button>
    </div>
  </Popup>
  );

};
export default KickUserButton;
