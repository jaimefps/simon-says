import React, { useState } from "react";
import { PASSIVE_COLORS } from "./constants";

export function BulbPure({
  color,
  activeBulb,
  playerBlocked,
  handleBulbClick,
}) {
  const [isPressed, setIsPressed] = useState(false);
  const bgc = activeBulb === color || isPressed ? color : PASSIVE_COLORS[color];
  return (
    <button
      className="bulb"
      style={{ backgroundColor: bgc }}
      onClick={playerBlocked ? undefined : handleBulbClick}
      onMouseUp={playerBlocked ? undefined : () => setIsPressed(false)}
      onMouseDown={playerBlocked ? undefined : () => setIsPressed(true)}
    />
  );
}

export function GameHeaderPure({
  manager,
  turnCount,
  isActiveGame,
  playerFailed,
  handleStart,
  gameOver,
}) {
  const handleCtaClick = isActiveGame ? gameOver : handleStart;
  const btnLabel = isActiveGame ? "QUIT" : "NEW GAME";
  return (
    <div className="header flex column">
      {manager}
      <button className="cta" onClick={handleCtaClick}>
        {btnLabel}
      </button>
      {playerFailed && (
        <>
          <p>Game Over</p>
          <p>{`Turn Count: ${turnCount - 1}`}</p>
        </>
      )}
    </div>
  );
}

export function GamePure({ Red, Blue, Green, Yellow, Header }) {
  return (
    <div className="flex column tall">
      {Header}
      <div>
        {Yellow}
        {Blue}
      </div>
      <div>
        {Red}
        {Green}
      </div>
    </div>
  );
}
