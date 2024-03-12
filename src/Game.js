import React, { useState, useEffect } from 'react';

const gridSize = 25;
const centerPosition = Math.floor(gridSize / 2);
const initialSnakeLength = 5; // Specify the desired initial length here
const initialSnake = [];
for (let i = 0; i < initialSnakeLength; i++) {
    initialSnake.push([centerPosition, centerPosition - i]);
}
const initialFood = [Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)];
const directions = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};
const initialDirection = directions.ArrowRight; // Initial direction

function SnakeGame() {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState(initialDirection);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const newDirection = directions[e.key];
      if (newDirection) {
        setDirection(newDirection);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const move = () => {
      let newHead = [snake[0][0] + direction[0], snake[0][1] + direction[1]];

      // Wall collision check
      if (newHead[0] >= gridSize || newHead[1] >= gridSize || newHead[0] < 0 || newHead[1] < 0) {
        setGameOver(true);
        return;
      }

      // Self collision check
      if (snake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
        setGameOver(true);
        return;
      }

      let newSnake = [newHead, ...snake];
      
      // food logic
      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        setFood([Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)]);
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const interval = setInterval(move, 200);

    return () => clearInterval(interval);
  }, [snake, direction, food, gameOver]);

  return (
    <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'column',
        backgroundColor: 'grey', // background color grey
        color: 'white', // text color white
        width: '100%', 
        height: '100vh', 
        fontSize: '20px'
    }}>
      <div>
      <h1>Snake Game</h1>
        {Array.from({ length: gridSize }, (_, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {Array.from({ length: gridSize }, (_, colIndex) => (
              <div
                key={colIndex}
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: snake.some(s => s[0] === rowIndex && s[1] === colIndex)
                    ? 'black' // Snake segment
                    : food[0] === rowIndex && food[1] === colIndex
                    ? 'red' // Food
                    : 'white', // Empty space
                  border: '1px solid gray', 
                }}
              />
            ))}
          </div>
        ))}
      </div>
      {gameOver && <div style={{ marginTop: 20 }}>Game Over. F5 to restart.</div>}
    </div>
);

}

export default SnakeGame;
