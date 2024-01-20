import React from "react"
import { useAtom, Provider } from "jotai"
import { COLORS } from "../constants"
import { BulbPure, GameHeaderPure, GamePure } from "../components"
import { state, useGameOver, useHandleStart, useHandleBulbClick } from "./state"

function Bulb({ color }) {
  const [{ playerBlocked, activeBulb }] = useAtom(state)
  const handleBulbClick = useHandleBulbClick(color)
  const props = {
    color,
    playerBlocked,
    activeBulb,
    handleBulbClick,
  }
  return <BulbPure {...props} />
}

function GameHeader() {
  const [{ isActiveGame, playerFailed, turnCount }] = useAtom(state)
  const handleStart = useHandleStart()
  const gameOver = useGameOver()
  const props = {
    manager: "jotai",
    turnCount,
    isActiveGame,
    playerFailed,
    handleStart,
    gameOver,
  }
  return <GameHeaderPure {...props} />
}

export default function Game() {
  const props = {
    Header: <GameHeader />,
    Red: <Bulb color={COLORS.RED} />,
    Blue: <Bulb color={COLORS.BLUE} />,
    Green: <Bulb color={COLORS.GREEN} />,
    Yellow: <Bulb color={COLORS.YELLOW} />,
  }
  return (
    <Provider>
      <GamePure {...props} />
    </Provider>
  )
}
