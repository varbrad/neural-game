// Snapshots the game state into a array of network weights
// Be careful!
import { WIDTH, HEIGHT } from './game';

export function createSnapshot(game) {
  const nextWall = game.walls.reduce(
    (p, c) => (c.x < p.x && c.x >= game.player.x ? c : p),
    game.walls[0]
  );

  let snap = {
    input: [
      game.speed / 5, // GAME SPEED -> 5 should be the maximum game speed,
      game.player.y / HEIGHT, // PLAYER Y POS -> 0 = very top, 1 = very bottom
      nextWall.x / WIDTH, // NEXT WALL X -> 0 = Very Close, 1 = Very Far,
      (game.player.y - nextWall.y) / HEIGHT + 0.5, // NEXT WALL Y -> 0 = Too High, 1 = Too Low, 0.5 = Just Right,
      nextWall.size / 250 // WALL GAP SIZE, 0 = Non-existant small, 1 = 250 pixels
    ],
    output: [
      game.keys.KeyW || game.keys.ArrowUp ? 1 : 0,
      game.keys.KeyS || game.keys.ArrowDown ? 1 : 0,
      game.keys.Space ? 1 : 0
    ]
  };

  const limit = v => Math.min(1, Math.max(0, v));

  snap.input = snap.input.map(limit);
  snap.output = snap.output.map(limit);

  return snap;
}
