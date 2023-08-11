import './Cards.scss'

const HistoryCard = () => {
  const gameScores = [
    { score: 150, date: new Date("2023-06-15") },
    { score: 200, date: new Date("2023-06-18") },
    { score: 180, date: new Date("2023-06-22") },
    { score: 220, date: new Date("2023-06-25") },
    { score: 190, date: new Date("2023-06-28") },
    { score: 150, date: new Date("2023-06-15") },
    { score: 200, date: new Date("2023-06-18") },
    { score: 180, date: new Date("2023-06-22") },
    { score: 220, date: new Date("2023-06-25") },
    { score: 190, date: new Date("2023-06-28") },
  ];

  return (
    <>
      <div className="history-card-wrapper">
        <h2>Game History</h2>
        <ul className="friend-list">
          {gameScores.map((game, index) => (
            <li className="friend-item" key={index}>
                <p>Date: {game.date.toDateString()}</p>
                <p>Score: {game.score}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default HistoryCard;
