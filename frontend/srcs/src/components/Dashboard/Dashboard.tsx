import React, { useRef, useEffect } from 'react';
import LeftMenu from '../Menu/LeftMenu';
import './Dashboard.scss';
import { Lobby } from '../Game/Lobby';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const Dashboard: React.FC = () => {
  const user = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      if (user) {
        dispatch({ type: 'WEBSOCKET_CONNECT', payload: user.id });
      }
    }
  }, [dispatch, user]);

  return (
    <div className="dashboard-wrapper">
      <LeftMenu />
      <div className="canvas-wrapper">
        <Lobby />
      </div>
    </div>
  );
};

export default Dashboard;
