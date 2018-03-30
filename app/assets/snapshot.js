export function createSnapshot(game) {
  return {
    input: {
      speed: game.speed
    },
    output: {
      up: game.keys.KeyW || game.keys.ArrowUp,
      down: game.keys.KeyS || game.keys.ArrowDown,
      fire: game.keys.Space
    }
  };
}
