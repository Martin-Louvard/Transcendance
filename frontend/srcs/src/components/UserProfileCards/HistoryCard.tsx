import './Cards.scss'
import { useEffect, useState } from 'react';
import { Game } from '@shared/class';
import { User} from '../../Types';
interface HistoryProps {
  user: User;
}


const HistoryCard: React.FC<HistoryProps> = ({user}) => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    console.log(user)
    async function fetchGames() {
        const requestOptions = {
          method: 'GET',
      };
    
      try{
          const response = await fetch(`http://localhost:3001/users/{id}/games?id=${user.id}`, requestOptions)
          const data = await response.json();
          setGames(data);
          console.log(games);
    
      }catch(err) {
        console.log(err);
      }

    }
    fetchGames();
  }, [])

  function isWinner(game: Game, id: number) {
    if  ((game.visitor.find((v) =>  v.id == user.id) && game.winner == 'visitor')
          ||
        (game.home.find((v) =>  v.id == user.id) && game.winner == 'home'))
      return true;
    else
      return true; 
  }

  return (
    <>
      <div className="card-wrapper">
        <h2>Game History</h2>
        <ul className="list">
          {games.map((game, index) => (
            <li className="item" key={index}>
                <p>Date: {new Date(game.createdAt).toDateString()}</p>
                <p>|</p>
                <div>

                <p >
                  {
                    isWinner(game, user.id) ?
                      " Win"
                        :
                      "Lost"
                  
                  //  ?
                  // `Visitor (you) - Home` :  `Visitor - Home (you)`
                }
                </p >
                <p style={{width: "150px"}}> {`${game.scoreVisitor} - ${game.scoreHome} `}</p>
                </div>
                {/*<p>Score: {game.score}</p>*/}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default HistoryCard;
