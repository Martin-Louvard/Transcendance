import React, { useState, ChangeEvent, FormEvent } from "react"; // Import ChangeEvent and FormEvent types
import { useAppSelector } from "../../redux/hooks";
import Form from "../Forms/Form";
import { useAppDispatch } from "../../redux/hooks";
import { Friend } from "../../Types";

const ChatCreator: React.FC = () => {
  const user = useAppSelector((state) => state.session.user);
  const friends = useAppSelector((state) => state.session.friends);
  const [name, setName] = useState<string | undefined>("");
  const [channelType, setChannelType] = useState("Private");
  const [password, setPassword] = useState<string | undefined>("");
  const [participants, setParticipants] = useState<(number | undefined)[]>([user?.id]);

  const dispatch = useAppDispatch();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => { 
    event.preventDefault();

    dispatch({
      type: "CREATE_CHAT",
      payload: {
        ownerId: user?.id,
        name: name,
        channelType: channelType,
        password: password,
        participants: participants,
      },
    });

    setName("");
    setChannelType("Private");
    setPassword("");
    setParticipants([]);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = event.target;
  
    if (id === "name") {
      setName(value);
    } else if (id === "type") {
      setChannelType(value);
    } else if (id === "password") {
      setPassword(value);
    } else if (type === "checkbox") {
      const participant = value;
      const isChecked = (event.target as HTMLInputElement).checked;
      if (isChecked) {
        setParticipants((prevParticipants) => [...prevParticipants, parseInt(participant)]);
      } else {
        setParticipants((prevParticipants) =>
          prevParticipants.filter((p) => p !== parseInt(participant))
        );
      }
    }
  };
  

  return (
    <div className="card-wrapper">
      <Form title="Chat Creator" buttonText="Create" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleChange}
        />
        <label htmlFor="type">Type</label>
          <select id="type" value={channelType} onChange={handleChange}>
            <option value="Private">Private</option>
            <option value="public">Public</option>
            <option value="Password">Password protected</option>
          </select>
          {channelType === "Password" ? (
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
          {friends ? (
            <fieldset id="participants">
              <legend>Participants</legend>
              {friends.map((f: Friend) => (
                <label key={f.id}>
                <input
                  type="checkbox"
                  value={f.id}
                  checked={participants.includes(f.id)}
                  onChange={handleChange}
                />
                {f.username}
              </label>
            ))}
          </fieldset>
        ) : null}
      </Form>
    </div>
  );
};

export default ChatCreator;
