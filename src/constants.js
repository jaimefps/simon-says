import redSound from "./sounds/red.wav";
import blueSound from "./sounds/blue.wav";
import greenSound from "./sounds/green.wav";
import yellowSound from "./sounds/yellow.wav";

export const COLORS = {
  RED: "red",
  YELLOW: "gold",
  GREEN: "green",
  BLUE: "blue",
};

export const PASSIVE_COLORS = {
  [COLORS.RED]: "pink",
  [COLORS.BLUE]: "lightblue",
  [COLORS.YELLOW]: "lightyellow",
  [COLORS.GREEN]: "lightgreen",
};

export const SOUND_CALLS = {
  [COLORS.RED]: () => new Audio(redSound).play(),
  [COLORS.BLUE]: () => new Audio(blueSound).play(),
  [COLORS.YELLOW]: () => new Audio(yellowSound).play(),
  [COLORS.GREEN]: () => new Audio(greenSound).play(),
};

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
