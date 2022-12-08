import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
import { _format } from "https://deno.land/std@0.165.0/path/_util.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

const trees = input
  .split(/\r\n/)
  .map((line) => line.split("").map((char) => parseInt(char)));

const vis = trees.map((line, i) =>
  line.map((tree, j) => {
    const obstructedFrom = new Set();
    const viewDistance = [0, 0, 0, 0];

    // a tree is visible if all other trees between it and an edge are shorter than it
    // check up
    for (let index = i - 1; index >= 0; index--) {
      //Check corner
      if (i !== 0) {
        if (!obstructedFrom.has("T")) {
          viewDistance[0]++;
        }
      }

      if (trees[index][j] >= tree) {
        obstructedFrom.add("T");
      }
    }

    //check right
    for (let index = j + 1; index <= line.length - 1; index++) {
      //Check corner
      if (j !== line.length - 1) {
        if (!obstructedFrom.has("R")) {
          viewDistance[1]++;
        }
      }

      if (trees[i][index] >= tree) {
        obstructedFrom.add("R");
      }
    }

    //check bottom
    for (let index = i + 1; index <= trees.length - 1; index++) {
      //Check corner
      if (i !== trees.length - 1) {
        if (!obstructedFrom.has("B")) {
          viewDistance[2]++;
        }
      }

      if (trees[index][j] >= tree) {
        // console.log(
        //   `${i} ${j} (${tree}) is obscured by ${index} ${j} (${
        //     trees[index][j]
        //   }) - ${trees[index][j] >= tree}`
        // );
        obstructedFrom.add("B");
      }
    }

    //check left
    for (let index = j - 1; index >= 0; index--) {
      //Check corner
      if (j !== 0) {
        if (!obstructedFrom.has("L")) {
          viewDistance[3]++;
        }
      }

      if (trees[i][index] >= tree) {
        // console.log(
        //   `${i} ${j} (${tree}) is obscured by ${index} ${j} (${
        //     trees[i][index]
        //   }) - ${trees[i][index] >= tree}`
        // );
        obstructedFrom.add("L");
      }
    }

    let scenicScore = 1;
    viewDistance.forEach((directionAmmount) => {
      scenicScore = scenicScore * directionAmmount;
    });
    return scenicScore;
  })
);

let result = 0;
vis.forEach((line) =>
  line.forEach((scenicScore) => {
    if (scenicScore > result) {
      result = scenicScore;
    }
  })
);

console.log(result);
