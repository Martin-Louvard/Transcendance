import './Cards.scss'
import { useEffect, useState } from 'react';
import { Game } from '@shared/class';
import { User} from '../../Types';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useAppSelector } from '../../redux/hooks';
interface HistoryProps {
  user: User;
}


const HistoryCard: React.FC<HistoryProps> = ({user}) => {
  const [games, setGames] = useState<Game[]>([]);
  const sessionUser = useAppSelector((state)=>state.session.user)
  const access_token = useAppSelector((state)=>state.session.access_token)
  useEffect(() => {
    async function fetchGames() {
        const requestOptions = {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${access_token}`},
      };
    
      try{
          const response = await fetch(`http://localhost:3001/users/{id}/games?id=${user.id}`, requestOptions)
          const data = await response.json();
          setGames(data);
    
      }catch(err) {
      }

    }
    fetchGames();
  }, [])

  function isWinner(game: Game, id: number):number {
    if  ((game.visitor.find((v) =>  v.id == user.id) && game.winner == 'visitor')
          ||
        (game.home.find((v) =>  v.id == user.id) && game.winner == 'home'))
      return 0;
    else if (game.winner == 'draw')
      return 1;
    else
      return 2; 
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
            <div key={"container" + index} className='history-container'>			  { isWinner(game, user.id) ? "":<img key={"image" + index}   src={'/crown.svg'} width={100} height={50} style={{ display: "flex", flexDirection: "column" }} />}
    
            <li className="item" key={index}>
                <p >Date: {new Date(game.createdAt).toDateString()}</p>
                <p>|</p>
                <div>
                <p >
                  {
                    isWinner(game, user.id) == 0 ?
                    "Won against "
                        :
                        isWinner(game, user.id) == 1 ?
                        "Draw against" :
                        "Lost against "
                      
                  
                  //  ?
                  // `Visitor (you) - Home` :  `Visitor - Home (you)`
                } {game.visitor[0].id === user.id ? game.home[0].username : game.visitor[0].username}
                </p >
                <p style={{width: "150px"}}> {`${game.scoreVisitor} - ${game.scoreHome} `}</p>
                </div>
                {/*<p>Score: {game.score}</p>*/}
            </li>
            </div>
            ))
            :
            <>
              {
                sessionUser.id === user.id ?
                <>
                  <p>Play to have an History</p>
                  <Button variant='contained' onClick={() => {navigate("/")}}>Play</Button>
                </>
                :
                <>
                  {user.username} has not played games yet
                </>
              }
            </>
          }
        </ul>
      </div>
    </>
  );
};

export default HistoryCard;
