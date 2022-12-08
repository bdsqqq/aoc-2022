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

    // a tree is visible if all other trees between it and an edge are shorter than it
    // check up
    for (let index = i - 1; index >= 0; index--) {
      if (trees[index][j] >= tree) {
        obstructedFrom.add("T");
      }
    }

    //check right
    for (let index = j + 1; index <= line.length - 1; index++) {
      if (trees[i][index] >= tree) {
        obstructedFrom.add("R");
      }
    }

    //check bottom
    for (let index = i + 1; index <= trees.length - 1; index++) {
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
      if (trees[i][index] >= tree) {
        // console.log(
        //   `${i} ${j} (${tree}) is obscured by ${index} ${j} (${
        //     trees[i][index]
        //   }) - ${trees[i][index] >= tree}`
        // );
        obstructedFrom.add("L");
      }
    }

    let temp = "";
    obstructedFrom.forEach((char) => {
      temp += char;
    });

    return temp;
  })
);

let result = 0;
vis.forEach((line) =>
  line.forEach((tree) => {
    if (tree.length < 4) {
      result = result + 1;
    }
  })
);

console.log(result);
