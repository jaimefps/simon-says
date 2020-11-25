import { combineReducers, createStore, applyMiddleware } from "redux";
import { useDispatch, useSelector } from "react-redux";
import thunk from "redux-thunk";
import produce from "immer";
import { getRandomColor, wait, calculateDelays } from "../utils";
import { initialState, SOUNDS } from "../constants";

export const ACTION_TYPES = {
  ACTIVATE: "ACTIVATE",
  DEACTIVATE: "DEACTIVATE",
  PLAYER_FAIL: "PLAYER_FAIL",
  PLAYER_SUCCESS: "PLAYER_SUCCESS",
  PLAYER_BLOCK: "PLAYER_BLOCK",
  PLAYER_UNBLOCK: "PLAYER_UNBLOCK",
  PLAYER_PRESS_INCREMENT: "PLAYER_PRESS_INCREMENT",
  PLAYER_PRESS_RESET: "PLAYER_PRESS_RESET",
  MACHINE_SEQUENCE_EXPAND: "MACHINE_SEQUENCE_EXPAND",
  MACHINE_SEQUENCE_RESET: "MACHINE_SEQUENCE_RESET",
  TURN_COUNT_INCREMENT: "TURN_COUNT_INCREMENT",
  TURN_COUNT_RESET: "TURN_COUNT_RESET",
  ACTIVE_BULB_SET: "ACTIVE_BULB_SET",
  RESET: "RESET",
};

function reducer(baseState = initialState, { type, payload }) {
  return produce(baseState, (draft) => {
    switch (type) {
      case ACTION_TYPES.ACTIVATE:
        draft.isActiveGame = true;
        break;
      case ACTION_TYPES.DEACTIVATE:
        draft.isActiveGame = false;
        break;
      case ACTION_TYPES.PLAYER_FAIL:
        draft.playerFailed = true;
        break;
      case ACTION_TYPES.PLAYER_SUCCESS:
        draft.playerFailed = false;
        break;
      case ACTION_TYPES.PLAYER_BLOCK:
        draft.playerBlocked = true;
        break;
      case ACTION_TYPES.PLAYER_UNBLOCK:
        draft.playerBlocked = false;
        break;
      case ACTION_TYPES.PLAYER_PRESS_INCREMENT:
        draft.playerPressCount = baseState.playerPressCount + 1;
        break;
      case ACTION_TYPES.PLAYER_PRESS_RESET:
        draft.playerPressCount = 0;
        break;
      case ACTION_TYPES.MACHINE_SEQUENCE_EXPAND:
        draft.machineSequence = [
          ...baseState.machineSequence,
          getRandomColor(),
        ];
        break;
      case ACTION_TYPES.MACHINE_SEQUENCE_RESET:
        draft.machineSequence = [];
        break;
      case ACTION_TYPES.TURN_COUNT_INCREMENT:
        draft.turnCount = baseState.turnCount + 1;
        break;
      case ACTION_TYPES.TURN_COUNT_RESET:
        draft.turnCount = 0;
        break;
      case ACTION_TYPES.ACTIVE_BULB_SET:
        draft.activeBulb = payload.activeBulb;
        break;
      case ACTION_TYPES.RESET:
        return initialState;
      // no default
    }
  });
}

const allReducers = combineReducers({ simon: reducer });
export const store = createStore(allReducers, applyMiddleware(thunk));

/****************
 *  Hooks
 ***************/

export function useGameOver() {
  const dispatch = useDispatch();
  return function () {
    SOUNDS.womp();
    dispatch({ type: ACTION_TYPES.DEACTIVATE });
    dispatch({ type: ACTION_TYPES.PLAYER_FAIL });
    dispatch({ type: ACTION_TYPES.MACHINE_SEQUENCE_RESET });
  };
}

export function useNextTurn() {
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
        SOUNDS[thisColor]();
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

export function useHandleBulbClick(color) {
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
      SOUNDS[color]();
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
