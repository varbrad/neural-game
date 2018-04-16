export function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function aabb(a, b) {
  const ax = a.x + a.hitbox.x;
  const bx = b.x + b.hitbox.x;
  const ay = a.y + a.hitbox.y;
  const by = b.y + b.hitbox.y;
  const aw = a.hitbox.w;
  const bw = b.hitbox.w;
  const ah = a.hitbox.h;
  const bh = b.hitbox.h;
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
