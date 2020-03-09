/* eslint-disable no-loop-func */
import React, { useEffect, useRef, useState } from "react";
import { Box, Controls, Wrap } from "./styled";

const INITIAL_DATA = {
  snake: [
    [15, 9],
    [15, 10],
  ],
  direction: "right",
};

const resetGame = (
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>,
  setSnake: React.Dispatch<React.SetStateAction<number[][]>>,
  setDirection: React.Dispatch<React.SetStateAction<string>>
) => {
  setGameOver(false);
  setSnake(INITIAL_DATA.snake);
  setDirection(INITIAL_DATA.direction);
};

const setupGrid = () => {
  const grid = [];
  for (let row = 0; row < 30; row++) {
    for (let col = 0; col < 30; col++) {
      grid.push([row, col]);
    }
  }

  return grid;
};

const generateFood = (
  snake: number[][],
  setFood?: React.Dispatch<React.SetStateAction<number[]>>,
  initial?: boolean
) => {
  let row = Math.floor(Math.random() * 30);
  let col = Math.floor(Math.random() * 30);

  while (snake.some(node => node[0] === row)) {
    row = Math.floor(Math.random() * 30);
  }

  while (snake.some(node => node[1] === col)) {
    col = Math.floor(Math.random() * 30);
  }

  if (initial) {
    return [row, col];
  }

  setFood!([row, col]);
  return [row, col];
};

const updateSnake = ({
  snake,
  setSnake,
  food,
  setFood,
  direction,
  setGameOver,
}: {
  snake: number[][];
  setSnake: React.Dispatch<React.SetStateAction<number[][]>>;
  direction: string | null;
  food: number[];
  setFood: React.Dispatch<React.SetStateAction<number[]>>;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const updatedSnake = snake.map((node, index) => {
    if (direction === "right")
      return index === snake.length - 1 ? [node[0], node[1] + 1] : snake[index + 1];
    else if (direction === "left")
      return index === snake.length - 1 ? [node[0], node[1] - 1] : snake[index + 1];
    else if (direction === "up")
      return index === snake.length - 1 ? [node[0] - 1, node[1]] : snake[index + 1];
    else if (direction === "down")
      return index === snake.length - 1 ? [node[0] + 1, node[1]] : snake[index + 1];
    else return node;
  });

  if (
    updatedSnake.some(node => node[0] < 0 || node[0] > 29) ||
    updatedSnake.some(node => node[1] < 0 || node[1] > 29) ||
    updatedSnake.some(
      (node, index) =>
        JSON.stringify(node) === JSON.stringify(updatedSnake[updatedSnake.length - 1]) &&
        index !== updatedSnake.length - 1
    )
  ) {
    return setGameOver(true);
  }

  if (JSON.stringify(updatedSnake[updatedSnake.length - 1]) === JSON.stringify(food)) {
    updatedSnake.unshift([updatedSnake[0][0], updatedSnake[0][1]]);
    generateFood(updatedSnake, setFood);
  }

  setSnake(updatedSnake);
};

const useInterval = (callback: any, delay: number | null) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      // @ts-ignore
      savedCallback.current();
    };
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const App = () => {
  const [snake, setSnake] = useState(INITIAL_DATA.snake);
  const [food, setFood] = useState(generateFood(snake, undefined, true));
  const [direction, setDirection] = useState(INITIAL_DATA.direction);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    document.onkeydown = event => {
      switch (event.keyCode) {
        case 37:
          setDirection(prevDir => (prevDir !== "right" ? "left" : "right"));
          break;
        case 38:
          setDirection(prevDir => (prevDir !== "down" ? "up" : "down"));
          break;
        case 39:
          setDirection(prevDir => (prevDir !== "left" ? "right" : "left"));
          break;
        case 40:
          setDirection(prevDir => (prevDir !== "up" ? "down" : "up"));
          break;
      }
    };
  }, []);

  useInterval(
    updateSnake.bind(null, { snake, setSnake, setGameOver, setFood, food, direction }),
    gameOver ? null : 500 / (snake.length / 4)
  );

  return (
    <>
      <Controls>
        <button onClick={() => resetGame(setGameOver, setSnake, setDirection)} disabled={!gameOver}>
          new game
        </button>
        <p>{`snake length: ${snake.length} ${gameOver ? "game over" : ""}`}</p>
      </Controls>
      <Wrap>
        {setupGrid().map((node, i) => {
          return (
            <Box
              key={i}
              isSnake={snake.some(coor => JSON.stringify(coor) === JSON.stringify(node))}
              isFood={JSON.stringify(node) === JSON.stringify(food)}
              isHead={JSON.stringify(snake[snake.length - 1]) === JSON.stringify(node)}
            />
          );
        })}
      </Wrap>
    </>
  );
};

export default App;
