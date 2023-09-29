import '../UserProfileCards/Cards.scss'
import { useEffect, useState } from 'react';
import { User } from 'src/Types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ContentOptions } from '../../Types';
import { setFriendProfile, setContentToShow } from '../../redux/sessionSlice';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
const [board, setBoard] = useState<User[]>();
const dispatch = useAppDispatch();
const navigate = useNavigate();
const access_token = useAppSelector((state)=>state.session.access_token)
const goToUserProfile = (user: User) => {
  dispatch(setFriendProfile(user));
 navigate("/friends/friendprofile");
};

  useEffect(() => {
    async function fetchGames() {
        const requestOptions = {
          headers: { 'Authorization': `Bearer ${access_token}`},
          method: 'GET',
      };
      try{
          const response = await fetch(`http://10.33.3.5:3001/game/leaderboard`, requestOptions)
          const data = await response.json();
          setBoard(data);
      }catch(err) {
      }
    }
    fetchGames();
  }, [])

  return (
    <>
      <div className="card-wrapper">
        <h2>Leaderboard</h2>
        <ul className="list">
          {board && board[0] && board?.map((user, index) => (

            <li className="item" key={index}  onClick={() => {goToUserProfile(user);}}>
                <div className='friend-picture'>
                    <img src={"http://10.33.3.5:3001/users/avatar/" + user.username + "/" + user.avatar.split("/").reverse()[0]}/>
                  </div>
                  <p>{user.username}</p>
                <p> {`V ${user.victoriesCount} - ${user.defeatCount} D`}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Leaderboard;
