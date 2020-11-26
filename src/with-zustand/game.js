import React from "react";
import { COLORS } from "../constants";
import { BulbPure, GameHeaderPure, GamePure } from "../components";
import { useStore } from "./state";

function Bulb({ color }) {
  const playerBlocked = useStore((state) => state.playerBlocked);
  const activeBulb = useStore((state) => state.activeBulb);
  const handleBulbClick = useStore((state) => state.handleBulbClick);
  const props = {
    color,
    playerBlocked,
    activeBulb,
    handleBulbClick: () => handleBulbClick(color),
  };
  return <BulbPure {...props} />;
}

function GameHeader() {
  const isActiveGame = useStore((state) => state.isActiveGame);
  const playerFailed = useStore((state) => state.playerFailed);
  const handleStart = useStore((state) => state.handleStart);
  const turnCount = useStore((state) => state.turnCount);
  const gameOver = useStore((state) => state.gameOver);
  const props = {
    manager: "zustand",
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
    manager: "zustand",
    Header: <GameHeader />,
    Red: <Bulb color={COLORS.RED} />,
    Blue: <Bulb color={COLORS.BLUE} />,
    Green: <Bulb color={COLORS.GREEN} />,
    Yellow: <Bulb color={COLORS.YELLOW} />,
  };
  return <GamePure {...props} />;
}
