import redSound from "./sounds/red.wav"
import blueSound from "./sounds/blue.wav"
import greenSound from "./sounds/green.wav"
import yellowSound from "./sounds/yellow.wav"
import womp from "./sounds/womp.wav"

export const COLORS = {
  RED: "red",
  YELLOW: "gold",
  GREEN: "green",
  BLUE: "blue",
}

export const PASSIVE_COLORS = {
  [COLORS.RED]: "pink",
  [COLORS.BLUE]: "lightblue",
  [COLORS.YELLOW]: "lightyellow",
  [COLORS.GREEN]: "lightgreen",
}

export const SOUNDS = {
  [COLORS.RED]: () => new Audio(redSound).play(),
  [COLORS.BLUE]: () => new Audio(blueSound).play(),
  [COLORS.YELLOW]: () => new Audio(yellowSound).play(),
  [COLORS.GREEN]: () => new Audio(greenSound).play(),
  womp: () => setTimeout(() => new Audio(womp).play(), 275),
}

export function getInitialState() {
  return {
    isActiveGame: false,
    playerFailed: false,
    playerBlocked: true,
    playerPressCount: 0,
    machineSequence: [],
    activeBulb: null,
    turnCount: 0,
  }
}
