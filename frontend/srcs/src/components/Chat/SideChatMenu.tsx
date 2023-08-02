import React, { useState } from 'react';
import { RootState } from '../../store';
import { User,
  ChatChannels,
  ChatChannelsProps as Props } from '../../Types';
import { useAppDispatch, useAppSelector } from '../../hooks';

const SideChatMenu: React.FC<Props> = ({ chatchannel, onChatChannelClick, onCreateChat }) => {
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [newChatName, setChatName] = useState('');
  const [newChatPasswd, setChatPasswd] = useState('');

  const userInfo: User = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const handleCreateChatClick = () => {
    setIsCreatingChat(true);
  };
  const handleChatSubmit = () => {
    fetch('http://localhost:3001/chat-channels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ owner: userInfo, name: newChatName, password: newChatPasswd})
    })
      .then((response) => response.json)
      .then((data) => {
        const newChat: ChatChannels = { id: data.id, Owner: data.owner}
      })
  }
}

