import { test } from "node:test";
import assert from "node:assert/strict";
import { WORLD } from "../lib/workshop-world.ts";
import { stepRover } from "../lib/movement.ts";
const games = await import("../lib/coastal-games.ts").catch(() => null);

test("coastal ground is exactly ten times the previous area", () => {
  assert.equal(WORLD.width * WORLD.depth, 20 * 16 * 10);
});
test("expanded shoreline bounds contain boosted movement", () => {
  const p = stepRover({ x: 31.19, z: 24.19 }, { x: 1, z: 1 }, 0.1, [], 10);
  assert.ok(p.x <= 31.2 && p.z <= 24.2);
  assert.ok(p.x >= 31.19 && p.z >= 24.19);
  assert.ok(stepRover({ x: 0, z: 0 }, { x: 1, z: 0 }, 0.1, [], 10).x > 0.9);
  const wall = [{ x: 1, z: 0, halfX: 0.05, halfZ: 2 }];
  const hit = stepRover({ x: 0, z: 0 }, { x: 1, z: 0 }, 0.1, wall, 10);
  assert.ok(hit.x < 0.6);
});
test("race needs ordered gates and a full return to the start", () => {
  assert.ok(games);
  let race = games.newRace();
  race = games.stepRace(race, games.RACE_START, 0.1);
  assert.equal(race.next, 0);
  for (const gate of games.RACE_GATES) race = games.stepRace(race, gate, 0.1);
  assert.equal(race.finished, true);
  assert.equal(race.invalid, false);
  assert.ok(race.elapsed > 0);
  assert.deepEqual(games.stepRace(race, games.RACE_START, 4), race);
});
test("leaving the circuit invalidates a lap and reset clears it", () => {
  assert.ok(games);
  const race = games.stepRace(games.newRace(), { x: -21, z: 0 }, 0.1);
  assert.equal(race.invalid, true);
  assert.equal(games.newRace().invalid, false);
});
test("equal visible time produces equal race time at different update rates", () => {
  assert.ok(games);
  for (const fps of [60, 10, 4]) {
    let race = games.newRace();
    for (let i = 0; i < fps * 10; i++) race = games.stepRace(race, games.RACE_START, 1 / fps);
    assert.ok(Math.abs(race.elapsed - 10) < 0.001, `${fps} fps counted ${race.elapsed}s instead of 10s`);
  }
});
test("rover impact knocks pins over, transfers motion, and a fresh rack resets them", () => {
  assert.ok(games);
  let pins = games.newPins();
  assert.equal(pins.length, 10);
  assert.equal(pins.filter((pin) => pin.fallen).length, 0);
  pins = games.stepPins(pins, { x: 21, z: -7 }, { x: 21, z: -9 }, 0.1);
  assert.ok(pins.some((pin) => pin.fallen));
  for (let i = 0; i < 180; i++) pins = games.stepPins(pins, { x: 0, z: 0 }, { x: 0, z: 0 }, 1 / 60);
  assert.ok(pins.filter((pin) => pin.fallen).length >= 2);
  assert.ok(pins.every((pin) => Number.isFinite(pin.x) && Number.isFinite(pin.z)));
  assert.equal(games.newPins().filter((pin) => pin.fallen).length, 0);
});
