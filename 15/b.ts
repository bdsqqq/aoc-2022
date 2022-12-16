// Blatantly stolen from https://github.com/rohan-fowlerharper/advent-of-code/blob/main/2022/15/2.ts

import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
import { _format } from "https://deno.land/std@0.165.0/path/_util.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

const sensorBeaconPair = input.split(/\r\n/).map((sensorBeaconString) =>
  sensorBeaconString.split(": ").map((sensorBeaconPair) =>
    sensorBeaconPair
      .split("at ")
      .filter((s) => s !== "Sensor " && s !== "closest beacon is ")
      .map((s) => s.split(",").map((s) => Number(s.split("=")[1])))
      .flat()
  )
);

const signals = sensorBeaconPair.map(([sensor, beacon]) => ({
  sensor,
  beacon,
  manhattanDistance:
    Math.abs(sensor[0] - beacon[0]) + Math.abs(sensor[1] - beacon[1]),
}));

const isWithinRange = (signal: typeof signals[number], point: number[]) =>
  Math.abs(signal.sensor[0] - point[0]) +
    Math.abs(signal.sensor[1] - point[1]) <=
  signal.manhattanDistance;

const SIZE = 4000000;
let unmarkedPoint: number[] | null = null;

sensors: for (const signal of signals) {
  for (
    let x = signal.sensor[0] - signal.manhattanDistance - 1;
    x <= signal.sensor[0] + signal.manhattanDistance + 1;
    x++
  ) {
    if (x < 0 || x > SIZE) continue;

    const distance =
      Math.abs(signal.sensor[0] - x) - 1 - signal.manhattanDistance;

    const p1 = [x, signal.sensor[1] - distance];
    const p2 = [x, signal.sensor[1] + distance];

    const check = (p: number[]) =>
      p[1] >= 0 && p[1] <= SIZE && !signals.some((s) => isWithinRange(s, p));

    if (check(p1)) unmarkedPoint = p1;
    if (check(p2)) unmarkedPoint = p2;

    if (unmarkedPoint !== null) break sensors;
  }
}

if (!unmarkedPoint) throw new Error("Not found");
console.log(unmarkedPoint[0] * 4000000 + unmarkedPoint[1]);
