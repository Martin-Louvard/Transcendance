import '../UserProfileCards/Cards.scss'
import { useEffect, useState } from 'react';
import { User } from 'src/Types';

const Leaderboard = () => {
const [board, setBoard] = useState<User[]>();

  useEffect(() => {
    async function fetchGames() {
        const requestOptions = {
          method: 'GET',
      };
      try{
          const response = await fetch(`http://localhost:3001/game/leaderboard`, requestOptions)
          const data = await response.json();
          setBoard(data);
      }catch(err) {
        console.log(err);
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
            <li className="item" key={index}>
                <div className='friend-picture'>
                    <img src={"http://localhost:3001/users/avatar/" + user.username + "/" + user.avatar.split("/").reverse()[0]}/>
                  </div>
                  <p>{user.username}</p>
                <p> {`${user.victoriesCount} - ${user.defeatCount} `}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Leaderboard;
