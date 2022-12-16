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

const row = 2000000;
const cantBeBeacon = new Set<string>();

sensorBeaconPair.forEach(([sensor, beacon], i) => {
  const [sensorX, sensorY] = sensor;
  const [beaconX, beaconY] = beacon;
  console.log("start sensor", i, sensor, beacon);

  const manhattanDistance =
    Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);

  for (let i = 0; i <= manhattanDistance; i++) {
    // if (i !== 6) continue;
    // for 8, 7 with a manhattan distance of 9
    // I wanna add 1 + 2 * not used manhattanDistance
    // to Y - manhattanDistance and Y + manhattanDistance
    // centered at X, so from x - i to x + i

    const aboveY = sensorY - manhattanDistance + i;
    const bellowY = sensorY + (manhattanDistance - i);

    if (aboveY === row || bellowY === row) {
      console.log("found a row");
      const xsToDraw = Array.from(
        { length: i * 2 + 1 },
        (_, j) => sensorX - i + j
      );

      xsToDraw.forEach((xToDraw) => {
        if (
          !sensorBeaconPair
            .flat()
            .some(
              ([x, y]) =>
                (x === xToDraw && y === aboveY) ||
                (x === xToDraw && y === bellowY)
            )
        ) {
          const finalY = aboveY === row ? aboveY : bellowY;
          cantBeBeacon.add(`${xToDraw}-${finalY}`);
        }
      });
    }
  }
});

console.log(cantBeBeacon.size);
