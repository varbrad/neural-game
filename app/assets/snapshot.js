// Snapshots the game state into a array of network weights
// Be careful!
import { WIDTH, HEIGHT } from './game';

export function createSnapshot(game) {
  return {
    input: [
      game.speed / 5, // 5 should be the maximum game speed,
      game.player.y / HEIGHT
    ],
    output: [
      game.keys.KeyW || game.keys.ArrowUp ? 1 : 0,
      game.keys.KeyS || game.keys.ArrowDown ? 1 : 0,
      game.keys.Space ? 1 : 0
    ]
  };
}
