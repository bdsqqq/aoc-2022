import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
import { _format } from "https://deno.land/std@0.165.0/path/_util.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

const motions = input.split(/\r\n/);

const rope = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
];

const TVisits = new Set();

const move = (pos: number[], dir: string) => {
  const output = [...pos];
  if (dir.includes("U")) {
    output[1] = output[1] + 1;
  }
  if (dir.includes("R")) {
    output[0] = output[0] + 1;
  }
  if (dir.includes("D")) {
    output[1] = output[1] - 1;
  }
  if (dir.includes("L")) {
    output[0] = output[0] - 1;
  }

  return output;
};

TVisits.add(`${rope[9][0]}_${rope[9][1]}`);

motions.forEach((motion) => {
  const [dir, steps] = motion.split(" ");
  for (let step = 1; step <= parseInt(steps); step++) {
    rope[0] = move(rope[0], dir);

    // move segments
    for (let knotNumber = 1; knotNumber < rope.length; knotNumber++) {
      let desiredDir = "";

      const prevKnot = rope[knotNumber - 1];
      const currentKnot = rope[knotNumber];

      const dx = Math.abs(currentKnot[0] - prevKnot[0]);
      const dy = Math.abs(currentKnot[1] - prevKnot[1]);
      const deltaIsBig = dx > 1 || dy > 1;

      // Only move if isn't touching
      if (deltaIsBig) {
        if (prevKnot[1] > currentKnot[1]) {
          desiredDir = desiredDir + "U";
        }
        if (prevKnot[0] > currentKnot[0]) {
          desiredDir = desiredDir + "R";
        }
        if (prevKnot[1] < currentKnot[1]) {
          desiredDir = desiredDir + "D";
        }
        if (prevKnot[0] < currentKnot[0]) {
          desiredDir = desiredDir + "L";
        }
        rope[knotNumber] = move(currentKnot, desiredDir);
        TVisits.add(`${rope[9][0]}_${rope[9][1]}`);
      }
    }
    // console.log({ H, T, dx, dy, deltaIsBig });
  }
});

console.log(TVisits.size);

// console.log(motions);
