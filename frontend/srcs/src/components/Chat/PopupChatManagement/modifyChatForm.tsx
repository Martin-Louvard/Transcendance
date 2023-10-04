import React, { useState, ChangeEvent } from "react";
import Form from "../../Forms/Form";
import { ChatChannels } from "../../../Types";
import { useAppDispatch } from "../../../redux/hooks";

const ModifyChatForm = ({chat}: {chat: ChatChannels | undefined}) => {
  const [name, setName] = useState(chat?.name);
  const [type, setType] = useState(chat?.channelType)
  const [password, setPassword] = useState(chat?.password);
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({
      type: "MODIFY_CHAT_INFO",
      payload: {
        id: chat?.id,
        name: name,
        channelType: type,
        password: password,
      },
    });

  };
  
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = event.target;
    if (id === "name")
      setName(value);
    else if (id === "type") 
      setType(value);
    else if (id === "password")
      setPassword(value);
  };

  return (
    <Form onSubmit={handleSubmit} title="Modify Chat" buttonText="Modify">
      <div >
        <label htmlFor="name">Name</label>
        <input type="name" id="name" value={name} onChange={handleChange} />
      </div>
      {type !== "general" ?
            <div>
      <label htmlFor="type">Type</label>
      <br></br>
          <select id="type" value={type} onChange={handleChange}>
            <option value="Private">Private</option>
            <option value="public">Public</option>
            <option value="Password">Password protected</option>
          </select>
          </div>
        : null}
      <div>
      {type === "Password" ? (
        <>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handleChange}
          />
        </>
      ) : null}
  </div>
    </Form>
  );
}
export default ModifyChatForm;
