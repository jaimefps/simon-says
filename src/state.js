import produce from "immer";
import thunk from "redux-thunk";
import { combineReducers, createStore, applyMiddleware } from "redux";
import { COLORS, ACTION_TYPES } from "./constants";

function getRandomColor() {
  const random = Math.random();
  if (random > 0.75) return COLORS.BLUE;
  if (random > 0.5) return COLORS.GREEN;
  if (random > 0.25) return COLORS.YELLOW;
  return COLORS.RED;
}

const initialState = {
  isActiveGame: false,
  playerFailed: false,
  playerBlocked: true,
  playerPressCount: 0,
  machineSequence: [],
  activeBulb: null,
  turnCount: 0,
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
