import React, { useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { COLORS, PASSIVE_COLORS, SOUND_CALLS, ACTION_TYPES } from "./constants";
import womp from "./sounds/womp.wav";
import { store } from "./state";

/****************
 *  Helpers
 ***************/

function wait(time) {
  return new Promise((res) => setTimeout(res, time));
}

function calculateDelays(count) {
  let timeBetween = 1000 - count * 100;
  timeBetween = timeBetween < 200 ? 200 : timeBetween;
  const lightOff = timeBetween / 3;
  return { timeBetween, lightOff };
}

/****************
 *  Hooks
 ***************/

function useGameOver() {
  const dispatch = useDispatch();
  return function () {
    setTimeout(() => new Audio(womp).play(), 275);
    dispatch({ type: ACTION_TYPES.DEACTIVATE });
    dispatch({ type: ACTION_TYPES.PLAYER_FAIL });
    dispatch({ type: ACTION_TYPES.MACHINE_SEQUENCE_RESET });
  };
}

function useNextTurn() {
  const dispatch = useDispatch();
  return function () {
    dispatch({ type: ACTION_TYPES.PLAYER_BLOCK });
    dispatch({ type: ACTION_TYPES.PLAYER_PRESS_RESET });
    dispatch({ type: ACTION_TYPES.TURN_COUNT_INCREMENT });
    dispatch({ type: ACTION_TYPES.MACHINE_SEQUENCE_EXPAND });
    dispatch(async (_, getState) => {
      const { machineSequence } = getState().simon;
      const { timeBetween, lightOff } = calculateDelays(machineSequence.length);
      const sequenceClone = [...machineSequence];
      while (sequenceClone.length) {
        const thisColor = sequenceClone.shift();
        await wait(timeBetween);
        SOUND_CALLS[thisColor]();
        dispatch({
          type: ACTION_TYPES.ACTIVE_BULB_SET,
          payload: { activeBulb: thisColor },
        });
        await wait(lightOff);
        dispatch({
          type: ACTION_TYPES.ACTIVE_BULB_SET,
          payload: { activeBulb: null },
        });
      }
      dispatch({ type: ACTION_TYPES.PLAYER_UNBLOCK });
    });
  };
}

function useHandleBulbClick(color) {
  const dispatch = useDispatch();
  const isActiveGame = useSelector((state) => state.simon.isActiveGame);
  const playerBlocked = useSelector((state) => state.simon.playerBlocked);
  const playerPressCount = useSelector((state) => state.simon.playerPressCount);
  const machineSequence = useSelector((state) => state.simon.machineSequence);
  const isValidBtn = machineSequence[playerPressCount] === color;
  const isAtLastPress = playerPressCount === machineSequence.length - 1;
  const nextTurn = useNextTurn();
  const gameOver = useGameOver();
  return function () {
    if (!playerBlocked && isActiveGame) {
      SOUND_CALLS[color]();
      if (isValidBtn) {
        if (isAtLastPress) {
          nextTurn();
        } else {
          dispatch({ type: ACTION_TYPES.PLAYER_PRESS_INCREMENT });
        }
      } else {
        gameOver();
      }
    }
  };
}

/****************
 *  Components
 ***************/

function Bulb({ color }) {
  const [isPressed, setIsPressed] = useState(false);
  const playerBlocked = useSelector((state) => state.simon.playerBlocked);
  const activeBulb = useSelector((state) => state.simon.activeBulb);
  const bgc = activeBulb === color || isPressed ? color : PASSIVE_COLORS[color];
  const handleBulbClick = useHandleBulbClick(color);
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
  const handleCtaClick = isActiveGame ? gameOver : handleStart;
  const btnLabel = isActiveGame ? "QUIT" : "NEW GAME";
  return (
    <div className="header flex column">
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

export default function Game() {
  return (
    <Provider store={store}>
      <div className="container flex column">
        <GameHeader />
        <div>
          <Bulb color={COLORS.YELLOW} />
          <Bulb color={COLORS.BLUE} />
        </div>
        <div>
          <Bulb color={COLORS.RED} />
          <Bulb color={COLORS.GREEN} />
        </div>
      </div>
    </Provider>
  );
}
