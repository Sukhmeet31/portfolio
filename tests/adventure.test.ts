import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RACE_GATES, RACE_START } from "../lib/coastal-games.ts";
const adventure = await import('../lib/adventure.ts').catch(() => null);

test('ghost replay interpolates position and takes the short heading turn', () => {
  assert.ok(adventure);
  const lap = { duration: 2, samples: [{ t: 0, x: -21, z: 13, heading: 3 }, { t: 2, x: -27, z: 13, heading: -3 }] };
  const pose = adventure.ghostAt(lap, 1);
  assert.equal(pose.x, -24);
  assert.ok(Math.abs(pose.heading - Math.PI) < 0.001);
  assert.equal(adventure.ghostAt(lap, 9).x, -27);
});
test('only a faster valid ghost replaces a personal best and samples stay bounded', () => {
  assert.ok(adventure);
  const recording = (duration: number) => ({ duration, samples: [
    { ...RACE_START, t: 0, heading: 0 },
    ...RACE_GATES.map((position, gate) => ({ ...position, gate, t: duration * (gate + 1) / 6, heading: 0 })),
  ] });
  const slow = recording(20);
  const fast = recording(18);
  assert.deepEqual(adventure.chooseBest(slow, fast), fast);
  assert.deepEqual(adventure.chooseBest(fast, slow), fast);
  let samples: import("../lib/adventure.ts").Sample[] = [];
  for (let i = 0; i < 4000; i++) samples = adventure.appendSample(samples, { x: -21, z: 13 }, i / 10);
  assert.ok(samples.length <= 1200);
  assert.equal(samples[0].t, 0);
  assert.equal(samples.at(-1)?.t, 399.9);
});
test('malformed saves and impossible ghosts are rejected safely', () => {
  assert.ok(adventure);
  assert.equal(adventure.readAdventure('{broken').best, null);
  const save = adventure.readAdventure(JSON.stringify({ found: ['grove', 'fake', 'grove'], best: { duration: -2, samples: [] }, paint: 'unknown' }));
  assert.deepEqual(save.found, ['grove']);
  assert.equal(save.best, null);
  const stationary = { duration: 20, samples: [{ t: 0, ...RACE_START, heading: 0 }, { t: 20, ...RACE_START, heading: 0 }] };
  assert.equal(adventure.readAdventure(JSON.stringify({ best: stationary })).best, null);
  assert.equal(save.paint, 'stock');
});
test('clues collect once and rewards depend on actual discoveries and stamps', () => {
  assert.ok(adventure);
  let found = adventure.collectNear([], adventure.CLUES[0]);
  found = adventure.collectNear(found, adventure.CLUES[0]);
  assert.equal(found.length, 1);
  assert.equal(adventure.unlocks(found, 0).coral, true);
  assert.equal(adventure.unlocks(found, 2).rally, false);
  assert.equal(adventure.unlocks(found, 3).rally, true);
  assert.equal(adventure.unlocks(['grove', 'north', 'shore', 'bottle'], 3).headlights, true);
  assert.ok(!adventure.collectNear([], adventure.CLUES[3]).includes('bottle'));
});
test('ferry endpoints and land bounds keep the two islands separate', () => {
  assert.ok(adventure);
  assert.deepEqual(adventure.ferryPosition(false, 0), adventure.MAIN_DOCK);
  assert.deepEqual(adventure.ferryPosition(false, 1), adventure.COVE_DOCK);
  assert.deepEqual(adventure.ferryPosition(true, 1), adventure.MAIN_DOCK);
  assert.equal(adventure.landBounds({ x: 50, z: 0 }).minX, 42.8);
  assert.equal(adventure.landBounds({ x: 0, z: 0 }).maxX, 31.2);
});
