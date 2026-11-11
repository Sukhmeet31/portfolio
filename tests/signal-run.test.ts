import { test } from "node:test";
import assert from "node:assert/strict";
const game = await import("../lib/signal-run.ts").catch(() => null);

test("only the next nearby signal can be collected", () => {
  assert.ok(game, "Signal Run module is available");
  assert.equal(game.advanceSignalRun(0, { x: 7, z: 0 }), 0);
  assert.equal(game.advanceSignalRun(0, { x: 0, z: 2.8 }), 0);
  assert.equal(game.advanceSignalRun(0, { x: 3, z: 2.8 }), 1);
  assert.equal(game.advanceSignalRun(1, { x: 3, z: 2.8 }), 1);
});
test("a complete circuit finishes once and stays finished", () => {
  assert.ok(game);
  let collected = 0;
  for (const position of [
    { x: 3, z: 2.8 },
    { x: 7, z: 0 },
    { x: -7, z: 0 },
    { x: -3, z: 2.8 },
    { x: 0, z: 2.8 },
  ])
    collected = game.advanceSignalRun(collected, position);
  assert.equal(collected, 5);
  assert.equal(game.advanceSignalRun(collected, { x: 0, z: 2.8 }), 5);
});
