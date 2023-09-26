import { ImVolumeMute2 } from "react-icons/im";
import { Popup } from 'reactjs-popup';
import { useState } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { User, ChatChannels } from "../../../Types.ts";

let contentStyle = { width:"fit-content", background: 'transparent', border: "none"};

const MuteUserButton = ({ user, chat }:{
  user: User; 
  chat: ChatChannels; }) => {

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

    const handleMuteTime = (time: number) => {
      dispatch({type: 'MUTE_USER', payload:[chat.id, user.id, time, 'mute']})
      handleKickButton();
    }

    return (
      <Popup 
        trigger={
          <div className="management-button" onClick={() => handleKickButton()}>
            <ImVolumeMute2 />
          </div>
        }
        position="top center"
        closeOnDocumentClick={true}
        onClose={() => setIsClicked(false)}
        nested
        {...{contentStyle}}>
        <div className="chat-popup popup-ban" >
          <button className="chrono-for-action" onClick={() => handleMuteTime(5)}>{"5min"}</button>
          <button className="chrono-for-action" onClick={() => handleMuteTime(10)}>{"10min"}</button>
          <button className="chrono-for-action" onClick={() => handleMuteTime(15)}>{"15min"}</button>
          <button className="chrono-for-action" onClick={() => handleMuteTime(20)}>{"20min"}</button>
        </div>
      </Popup>
    );
  };
export default MuteUserButton;
