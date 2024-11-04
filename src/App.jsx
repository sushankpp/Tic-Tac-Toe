import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPage, setShowPage] = useState('homePage');
  const [saveData, setSaveData] = useState({
    mode: '',
    playerChoice: '',
  });
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  const winCombo = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = (board) => {
    for (let combination of winCombo) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        return board[a];
      }
    }
    if (board.every((cell) => cell !== null)) {
      setWinner('Draw');
      return 'Draw';
    }
    return null;
  };

  const handleCellClick = (index) => {
    if (board[index] || winner || showPage !== 'gameBox') return; // Prevent clicking on occupied cells or if the game is over

    if (saveData.mode === 'human vs computer') {
      if (isPlayerTurn) {
        makeMove(index, saveData.playerChoice);
        const newBoard = [
          ...board.slice(0, index),
          saveData.playerChoice,
          ...board.slice(index + 1),
        ];
        if (checkWinner(newBoard)) return; // Check if player won after their move
        setIsPlayerTurn(false);

        // Computer's move after a delay
        setTimeout(() => {
          const emptyCells = newBoard
            .map((cell, idx) => (cell === null ? idx : null))
            .filter((val) => val !== null);

          if (emptyCells.length > 0) {
            const randomCell =
              emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const computerChoice = saveData.playerChoice === 'X' ? 'O' : 'X';
            makeMove(randomCell, computerChoice);
            checkWinner([
              ...newBoard.slice(0, randomCell),
              computerChoice,
              ...newBoard.slice(randomCell + 1),
            ]);
            setIsPlayerTurn(true);
          }
        }, 500);
      }
    } else if (saveData.mode === 'human vs human') {
      const choice = isPlayerTurn
        ? saveData.playerChoice
        : saveData.playerChoice === 'X'
        ? 'O'
        : 'X';
      makeMove(index, choice);
      const newBoard = [
        ...board.slice(0, index),
        choice,
        ...board.slice(index + 1),
      ];
      checkWinner(newBoard); // Check if the move resulted in a win
      setIsPlayerTurn(!isPlayerTurn);
    }
  };

  const makeMove = (index, choice) => {
    setBoard((prevBoard) => {
      return prevBoard.map((cell, idx) => (idx === index ? choice : cell));
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handlePage = (nextPage, data = {}) => {
    setShowPage(nextPage);

    if (data.mode || data.playerChoice) {
      setSaveData((prevData) => ({
        ...prevData,
        ...data,
      }));
    }
  };

  return (
    <>
      <div className="strings">
        <div className="string1"></div>
        <div className="string2"></div>
      </div>
      <section className="gameBoardSec">
        {showPage === 'homePage' && (
          <section className={`homePage ${isVisible ? 'show' : ''}`}>
            <div className="header">
              <div className="logo">
                <img
                  src="/src/assets/images/tictactoe.png"
                  alt="tic-tac-toe logo"
                />
              </div>
              <div className="Gname">
                <h1>tic tac toe</h1>
              </div>
            </div>

            <div className="gameMode">
              <div
                className="mode"
                onClick={() =>
                  handlePage('pickYourSide', { mode: 'human vs computer' })
                }
              >
                <span>human vs computer</span>
              </div>
              <div
                className="mode"
                onClick={() =>
                  handlePage('pickYourSide', { mode: 'human vs human' })
                }
              >
                <span>human vs human </span>
              </div>
            </div>
          </section>
        )}

        {showPage === 'pickYourSide' && (
          <section className="pickYourSide">
            <div className="header">
              <div className="logo">
                <img
                  src="/src/assets/images/tictactoe.png"
                  alt="tic-tac-toe logo"
                />
              </div>
              <div className="Gname">
                <h1>tic tac toe</h1>
              </div>
            </div>

            <div className="pickSide">
              <h2>Choose your side?</h2>

              <div className="side">
                <div
                  className="pick crosses"
                  onClick={() => handlePage('gameBox', { playerChoice: 'X' })}
                >
                  <span>X</span>
                </div>
                <div
                  className="pick noughts"
                  onClick={() => handlePage('gameBox', { playerChoice: 'O' })}
                >
                  <span>O</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {showPage === 'gameBox' && (
          <section className="gameBox">
            <div className="header">
              <div className="logo">
                <img
                  src="/src/assets/images/tictactoe.png"
                  alt="tic-tac-toe logo"
                />
              </div>
              <div className="Gname">
                <h1>tic tac toe</h1>
              </div>
            </div>

            <div className="gameBoard">
              {board.map((cell, index) => (
                <div
                  key={index}
                  className="cell"
                  onClick={() => handleCellClick(index)}
                >
                  {cell}
                </div>
              ))}
            </div>

            <div className="gameInfo">
              <p>Selected Mode: {saveData.mode}</p>
              <p>Player Choice: {saveData.playerChoice}</p>
              {winner && (
                <p>
                  {winner === 'Draw' ? "It's a Draw!" : `Winner: ${winner}`}
                </p>
              )}
            </div>
          </section>
        )}
      </section>
    </>
  );
}

export default App;
