import styled from "@emotion/styled";

export const Wrap = styled.div`
  width: 600px;
  height: 600px;
  display: flex;
  margin: 0 auto;
  flex-wrap: wrap;
  margin-top: 30px;
`;

export const Controls = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  align-items: center;
`;

export const Box = styled.div<{ isSnake: boolean; isFood: boolean; isHead: boolean }>`
  width: 20px;
  height: 20px;
  border: 1px solid black;
  background-color: ${({ isSnake, isFood, isHead }) => {
    if (isHead) return "green";
    if (isSnake) return "black";
    if (isFood) return "red";
    return "";
  }};
`;
