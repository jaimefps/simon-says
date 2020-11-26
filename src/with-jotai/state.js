import { atom, useAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { initialState, SOUNDS } from "../constants";
import { getRandomColor, calculateDelays, wait } from "../utils";

const cloneInitialState = JSON.parse(JSON.stringify(initialState));

export const state = atom(cloneInitialState);

export function useHandleStart() {
  const nextTurn = useNextTurn();
  const setGameState = useUpdateAtom(state);
  return function () {
    setGameState(() => ({
      ...cloneInitialState,
      isActiveGame: true,
    }));
    nextTurn();
  };
}

export function useGameOver() {
  const setGameState = useUpdateAtom(state);
  return function () {
    SOUNDS.womp();
    setGameState((state) => ({
      ...state,
      isActiveGame: false,
      playerFailed: true,
      playerBlocked: true,
      machineSequence: [],
    }));
  };
}

export function useNextTurn() {
  const [gameState, setGameState] = useAtom(state);
  return async function () {
    const { turnCount, machineSequence } = gameState;
    const nextSequence = [...machineSequence, getRandomColor()];
    const { timeBetween, lightOff } = calculateDelays(nextSequence.length);
    setGameState((state) => ({
      ...state,
      playerBlocked: true,
      playerPressCount: 0,
      turnCount: turnCount + 1,
      machineSequence: [...nextSequence],
    }));
    /**
     * HOW TO READ state.playerFailed here
     * and not have stale data?
     */
    while (nextSequence.length) {
      console.log("gameState.playerFailed", gameState.playerFailed);
      const thisColor = nextSequence.shift();
      await wait(timeBetween);
      SOUNDS[thisColor]();
      setGameState((state) => ({
        ...state,
        activeBulb: thisColor,
      }));
      await wait(lightOff);
      setGameState((state) => ({
        ...state,
        activeBulb: null,
      }));
    }
    setGameState((state) => ({
      ...state,
      playerBlocked: false,
    }));
  };
}

export function useHandleBulbClick(color) {
  const gameOver = useGameOver();
  const nextTurn = useNextTurn();
  const [gameState, setGameState] = useAtom(state);
  return function () {
    const {
      isActiveGame,
      playerBlocked,
      playerPressCount,
      machineSequence,
    } = gameState;
    const isValidBtn = machineSequence[playerPressCount] === color;
    const isAtLastPress = playerPressCount === machineSequence.length - 1;
    if (!playerBlocked && isActiveGame) {
      SOUNDS[color]();
      if (isValidBtn) {
        if (isAtLastPress) {
          nextTurn();
        } else {
          setGameState((state) => ({
            ...state,
            playerPressCount: playerPressCount + 1,
          }));
        }
      } else {
        gameOver();
      }
    }
  };
}
