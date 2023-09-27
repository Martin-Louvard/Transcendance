import './Cards.scss'
import { useEffect, useState } from 'react';
import { Game } from '@shared/class';
import { User} from '../../Types';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
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
          const response = await fetch(`http://10.33.4.5:3001/users/{id}/games?id=${user.id}`, requestOptions)
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
    console.log(game)
    if  ((game.visitor.find((v) =>  v.id == user.id) && game.winner == 'visitor')
          ||
        (game.home.find((v) =>  v.id == user.id) && game.winner == 'home'))
      return true;
    else
      return false; 
  }

  const navigate = useNavigate();

  return (
    <>
      <div className="card-wrapper">
        <h2>Game History</h2>
        <ul className="list">
          {
            games && games.length > 0 ?
          games.map((game, index) => (
            <>			  { isWinner(game, user.id) ? <img src={'/crown.svg'} width={100} height={50} style={{ display: "flex", flexDirection: "column" }} /> : ""}
    
            <li className="item" key={index}>
                <p>Date: {new Date(game.createdAt).toDateString()}</p>
                <p>|</p>
                <div>
                <p >
                  {
                    isWinner(game, user.id) ?
                      "Won against "
                        :
                      "Lost against "
                  
                  //  ?
                  // `Visitor (you) - Home` :  `Visitor - Home (you)`
                } {game.visitor[0].id === user.id ? game.home[0].username : game.visitor[0].username}
                </p >
                <p style={{width: "150px"}}> {`${game.scoreVisitor} - ${game.scoreHome} `}</p>
                </div>
                {/*<p>Score: {game.score}</p>*/}
            </li>
            </>
            ))
            :
            <>
              <p>Play to have an History</p>
              <Button variant='contained' onClick={() => {navigate("/")}}>Play</Button>
            </>
          }
        </ul>
      </div>
    </>
  );
};

export default HistoryCard;
