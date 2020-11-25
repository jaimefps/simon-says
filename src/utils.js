import { COLORS } from "./constants";

export function wait(time) {
  return new Promise((res) => setTimeout(res, time));
}

export function calculateDelays(count) {
  let timeBetween = 1000 - count * 100;
  timeBetween = timeBetween < 200 ? 200 : timeBetween;
  const lightOff = timeBetween / 3;
  return { timeBetween, lightOff };
}

export function getRandomColor() {
  const random = Math.random();
  if (random > 0.75) return COLORS.BLUE;
  if (random > 0.5) return COLORS.GREEN;
  if (random > 0.25) return COLORS.YELLOW;
  return COLORS.RED;
}
