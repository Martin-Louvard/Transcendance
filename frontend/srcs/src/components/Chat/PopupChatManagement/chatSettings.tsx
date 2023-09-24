import { User, ChatChannels } from "../../../Types.ts";

const ChatSettings = ({chat} : {chat: ChatChannels}) => {
  return (
    <div className="management-chat-settings-wrapper">
      <div className="management-chat-settings"></div>
    </div>
  );
};
export default ChatSettings;
