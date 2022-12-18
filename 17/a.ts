import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
import { _format } from "https://deno.land/std@0.165.0/path/_util.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

const jetPattern = input.split("") as ("<" | ">")[];
const jetDir = {
  "<": -1,
  ">": 1,
};

const horizontalLine = [["@", "@", "@", "@"]];
const plus = [
  [".", "@", "."],
  ["@", "@", "@"],
  [".", "@", "."],
];
const reverseL = [
  [".", ".", "@"],
  [".", ".", "@"],
  ["@", "@", "@"],
];
const verticalLine = [["@"], ["@"], ["@"], ["@"]];
const square = [
  ["@", "@"],
  ["@", "@"],
];

const rocks = [horizontalLine, plus, reverseL, verticalLine, square];
const chamberWidth = 7;

const chamber = new Array(5)
  .fill(0)
  .map((_, i) => new Array(chamberWidth).fill(i === 0 ? "-" : "."));

const rocksToAdd = 2022;
let top = 1;
let jetCount = 0;

for (let i = 0; i < rocksToAdd; i++) {
  type Rock = {
    form: typeof rocks[0];
    pos: undefined | { x: number; y: number }[][];
    atRest: boolean;
  };
  // console.log(i + 1, "rock begins falling");

  const rock: Rock = {
    form: [...rocks[i % rocks.length]].reverse(), // choose rock form
    pos: undefined,
    atRest: false,
  };
  // if there's not enough vertical space, add it to the chamber
  while (top + rock.form.length + 3 > chamber.length) {
    chamber.push(new Array(chamberWidth).fill("."));
  }
  // place rock and track its position
  // Each rock appears so that its left edge is two units away from the left wall and its bottom edge is three units above the highest rock in the room (or the floor, if there isn't one)
  rock.pos = rock.form.map((row, y) =>
    row.map((_, x) => ({ x: x + 2, y: top + 3 + y }))
  );

  // move rock down until it hits something
  while (!rock.atRest) {
    // try to move the rock based on the jet pattern
    const jet = jetPattern[jetCount % jetPattern.length];
    jetCount++;
    const jetVector = jetDir[jet];

    // Only move the rock if it's not going to hit the wall, the floor or another rock
    if (
      rock.pos?.some((row) =>
        row.some(
          (pos) =>
            pos.x + jetVector < 0 ||
            pos.x + jetVector >= 7 ||
            pos.y - 1 < 0 ||
            chamber[pos.y][pos.x + jetVector] !== "."
        )
      )
    ) {
      // console.log(
      //   "Jet gas pushes rock",
      //   jet === "<" ? "left" : "right",
      //   "but nothing happens"
      // );
    } else {
      // console.log("Jet gas pushes rock", jet === "<" ? "left" : "right");
      rock.pos = rock.pos?.map((row) =>
        row.map((pos) => ({ ...pos, x: pos.x + jetVector }))
      );
    }

    // if it hits something, mark it as at rest
    const canFall = rock.pos?.every((row, y) =>
      row.every((pos, x) => {
        // don't evaluate empty spaces in the rock
        if (rock.form[y][x] === ".") return true;
        // if it's on top of another rock, it's at rest
        if (chamber[pos.y - 1][pos.x] !== ".") {
          return false;
        }
        return true;
      })
    );
    // console.log(canFall, rock.pos);

    if (canFall) {
      // move rock down
      // console.log("Rock falls 1 unit");
      rock.pos = rock.pos?.map((row) =>
        row.map((pos) => ({ ...pos, y: pos.y - 1 }))
      );
    } else {
      rock.atRest = true;
      break;
    }
  }
  // add rock to chamber
  rock.pos?.forEach((row, y) =>
    row.forEach((pos, x) => {
      if (rock.form[y][x] === ".") return;
      chamber[pos.y][pos.x] = "#";
    })
  );

  const topOfThisRock =
    rock.pos?.reduce((acc, row) => {
      const lowest = row.reduce((acc, pos) => (pos.y > acc ? pos.y : acc), 0);
      return lowest > acc ? lowest : acc;
    }, 0) + 1;

  if (topOfThisRock > top) {
    top = topOfThisRock;
  }
}

let y = chamber.length - 1;
[...chamber].reverse().map((row) => console.log(y--, row.join("")));
console.log("Top:", top - 1);
