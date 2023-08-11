import React, { useState } from 'react';
import ProfileCard from '../UserProfileCards/ProfileCard';
import FriendsCard from '../UserProfileCards/FriendsCard';
import HistoryCard from '../UserProfileCards/HistoryCard';
import { useAppSelector } from "../../redux/hooks";
import './LeftMenu.scss';

const LeftMenu = () => {
  const user = useAppSelector((state) => state.user);
  const [fullscreen, setFullScreen] = useState(false);
  const [menuCss, setMenuCss] = useState("open-menu");
  const [contentToShow, setContentToShow] = useState("menu");

  const toggleMenu = () => {
    setMenuCss((prevCss) =>
      prevCss.startsWith("open") ? "close-menu menu-transition-close" : "open-menu menu-transition-open"
    );
    setFullScreen((prevFullscreen) => !prevFullscreen);
  };

  const handleClick = (event: React.MouseEvent<any>) => {
    event.preventDefault();

    const targetId = event.currentTarget.id;
    if (targetId === "profile") setContentToShow("profile");
    else if (targetId === "friends") setContentToShow("friends");
    else if (targetId === "history") setContentToShow("games");
    else if (targetId === "back") setContentToShow("menu");
  };

  const renderContent = () => {
    if (fullscreen) return null;

    if (contentToShow === "profile") return <ProfileCard {...user} />;
    if (contentToShow === "friends") return <FriendsCard />;
    if (contentToShow === "games") return <HistoryCard />;
    return renderMenuButtons();
  };

  const renderMenuButtons = () => (
    <>
      <button id="friends" onClick={handleClick}>
        Friends
      </button>
      <button id="history" onClick={handleClick}>
        LeaderBoard
      </button>
      <button id="profile" onClick={handleClick}>
        My Profile
      </button>
    </>
  );

  return (
    <>
      <div className={`menu-wrapper ${menuCss}`}>
        {(contentToShow !== "menu" || fullscreen) && (
          <img
            id="back"
            onClick={handleClick}
            className="exit-button"
            src={'cross.svg'}
            alt="Close"
          />
        )}
        <img
          className={`logo-nav menu-icon`}
          src={'/menu.svg'}
          alt="Menu"
          onClick={toggleMenu}
        />
        <div className="inner-menu-wrapper">{renderContent()}</div>
      </div>
    </>
  );
};

export default LeftMenu;
