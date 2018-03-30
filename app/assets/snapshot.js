export function createSnapshot(game) {
  return {
    input: {
      speed: game.speed
    },
    output: {
      keys: game.keys
    }
  };
}
