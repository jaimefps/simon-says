import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BulbPure, GameHeaderPure, GamePure } from "../components";
import { COLORS } from "../constants";
import {
  store,
  ACTION_TYPES,
  useHandleBulbClick,
  useNextTurn,
  useGameOver,
} from "./state";

function Bulb({ color }) {
  const playerBlocked = useSelector((state) => state.simon.playerBlocked);
  const activeBulb = useSelector((state) => state.simon.activeBulb);
  const handleBulbClick = useHandleBulbClick(color);
  const props = { color, playerBlocked, activeBulb, handleBulbClick };
  return <BulbPure {...props} />;
}

function GameHeader() {
  const dispatch = useDispatch();
  const isActiveGame = useSelector((state) => state.simon.isActiveGame);
  const playerFailed = useSelector((state) => state.simon.playerFailed);
  const turnCount = useSelector((state) => state.simon.turnCount);
  const nextTurn = useNextTurn();
  const gameOver = useGameOver();
  function handleStart() {
    dispatch({ type: ACTION_TYPES.RESET });
    dispatch({ type: ACTION_TYPES.ACTIVATE });
    nextTurn();
  }
  const props = {
    manager: "redux",
    turnCount,
    isActiveGame,
    playerFailed,
    handleStart,
    gameOver,
  };
  return <GameHeaderPure {...props} />;
}

export default function Game() {
  const props = {
    manager: "redux",
    Header: <GameHeader />,
    Red: <Bulb color={COLORS.RED} />,
    Blue: <Bulb color={COLORS.BLUE} />,
    Green: <Bulb color={COLORS.GREEN} />,
    Yellow: <Bulb color={COLORS.YELLOW} />,
  };
  return (
    <Provider store={store}>
      <GamePure {...props} />
    </Provider>
  );
}
