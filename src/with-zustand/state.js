import create from "zustand"
import { getInitialState, SOUNDS } from "../constants"
import { getRandomColor, calculateDelays, wait } from "../utils"

const cloneInitialState = getInitialState()

export const useStore = create((set, get) => ({
  /**************
   * state
   **************/
  ...cloneInitialState,

  /**************
   * functions
   **************/
  gameOver: () => {
    SOUNDS.womp()
    set({
      playerBlocked: true,
      isActiveGame: false,
      playerFailed: true,
      machineSequence: [],
    })
  },

  nextTurn: async () => {
    const { turnCount, machineSequence } = get()
    const nextSequence = [...machineSequence, getRandomColor()]
    const { timeBetween, lightOff } = calculateDelays(nextSequence.length)
    set({
      playerBlocked: true,
      playerPressCount: 0,
      turnCount: turnCount + 1,
      machineSequence: [...nextSequence],
    })
    while (nextSequence.length && !get().playerFailed) {
      const thisColor = nextSequence.shift()
      await wait(timeBetween)
      SOUNDS[thisColor]()
      set({ activeBulb: thisColor })
      await wait(lightOff)
      set({ activeBulb: null })
    }
    set({ playerBlocked: false })
  },

  handleStart: () => {
    const { nextTurn } = get()
    set({
      ...getInitialState(),
      isActiveGame: true,
    })
    nextTurn()
  },

  handleBulbClick: (color) => {
    const {
      gameOver,
      nextTurn,
      isActiveGame,
      playerBlocked,
      playerPressCount,
      machineSequence,
    } = get()
    const isValidBtn = machineSequence[playerPressCount] === color
    const isAtLastPress = playerPressCount === machineSequence.length - 1
    if (!playerBlocked && isActiveGame) {
      SOUNDS[color]()
      if (isValidBtn) {
        if (isAtLastPress) {
          nextTurn()
        } else {
          set({ playerPressCount: playerPressCount + 1 })
        }
      } else {
        gameOver()
      }
    }
  },
}))
