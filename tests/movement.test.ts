import { test } from "node:test";
import assert from "node:assert/strict";

// These catch collision tunnelling, frame-dependent speed, and diagonal acceleration.
const movement = await import("../lib/movement.ts").catch(() => null);
test("movement API is available", () => assert.ok(movement?.stepRover));
test("one second of motion is independent of frame rate", () => {
  assert.ok(movement);
  const run = (frames: number) => {
    let p = { x: 0, z: 0 };
    for (let i = 0; i < frames; i++)
      p = movement.stepRover(p, { x: 1, z: 0 }, 1 / frames, []);
    return p;
  };
  assert.ok(Math.abs(run(30).x - run(120).x) < 0.001);
  assert.ok(run(60).x > 2);
});
test("diagonal movement is no faster than straight movement", () => {
  assert.ok(movement);
  const p = movement.stepRover({ x: 0, z: 0 }, { x: 1, z: 1 }, 0.05, []);
  const straight = movement.stepRover({ x: 0, z: 0 }, { x: 1, z: 0 }, 0.05, []);
  assert.ok(Math.abs(Math.hypot(p.x, p.z) - straight.x) < 0.0001);
});
test("courtyard bounds cannot be crossed", () => {
  assert.ok(movement);
  for (const sign of [-1, 1]) {
    const p = movement.stepRover(
      { x: sign * 31.19, z: sign * 24.19 },
      { x: sign, z: sign },
      3,
      [],
    );
    assert.ok(Math.abs(p.x) <= 31.2 && Math.abs(p.z) <= 24.2);
    assert.ok(Math.abs(p.x) >= 31.19 && Math.abs(p.z) >= 24.19);
  }
});
test("rover can explore the new space beyond the former courtyard edges", () => {
  assert.ok(movement);
  const p = movement.stepRover({ x: 5.49, z: 4.49 }, { x: 1, z: 1 }, 0.1, []);
  assert.ok(p.x > 5.6 && p.z > 4.6);
});
test("rover cannot tunnel through a station and can slide alongside it", () => {
  assert.ok(movement);
  const obstacle = [{ x: 1, z: 0, halfX: 0.5, halfZ: 0.5 }];
  let p = { x: 0, z: 0 };
  for (let i = 0; i < 60; i++)
    p = movement.stepRover(p, { x: 1, z: 0 }, 1 / 60, obstacle);
  assert.ok(p.x < 0.2);
  const slide = movement.stepRover(p, { x: 1, z: 1 }, 0.05, obstacle);
  assert.ok(slide.z > 0);
});
