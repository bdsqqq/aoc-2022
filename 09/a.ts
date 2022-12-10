import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
import { _format } from "https://deno.land/std@0.165.0/path/_util.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

const motions = input.split(/\r\n/);

let H = [0, 0];
let T = [0, 0];

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

TVisits.add(`${T[0]}_${T[1]}`);

motions.forEach((motion) => {
  const [dir, steps] = motion.split(" ");
  for (let step = 1; step <= parseInt(steps); step++) {
    H = move(H, dir);

    let desiredDir = "";

    const dx = Math.abs(T[0] - H[0]);
    const dy = Math.abs(T[1] - H[1]);
    const deltaIsBig = dx > 1 || dy > 1;

    // Only move if isn't touching
    if (deltaIsBig) {
      if (H[1] > T[1]) {
        desiredDir = desiredDir + "U";
      }
      if (H[0] > T[0]) {
        desiredDir = desiredDir + "R";
      }
      if (H[1] < T[1]) {
        desiredDir = desiredDir + "D";
      }
      if (H[0] < T[0]) {
        desiredDir = desiredDir + "L";
      }
      T = move(T, desiredDir);
      TVisits.add(`${T[0]}_${T[1]}`);
    }
    // console.log({ H, T, dx, dy, deltaIsBig });
  }
});

console.log(TVisits.size);

// console.log(motions);
