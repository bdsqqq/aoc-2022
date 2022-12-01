// Find the Elf carrying the most Calories. How many total Calories is that Elf carrying?

import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

let chunkIndex = 0;
const elves = input.split(/\r\n/).reduce((resultArray: string[][], item) => {
  if (resultArray.length == 0 || item == "") {
    if (item == "") {
      chunkIndex++;
    }
    const temp: string[] = [];
    resultArray[chunkIndex] = temp; // start a new chunk
  }

  if (item !== "") {
    resultArray[chunkIndex].push(item);
  }

  return resultArray;
}, []);

const totalElves = elves.map((elf) => {
  let temp = 0;
  elf.forEach((item) => {
    temp = temp + parseInt(item);
  });
  return temp;
});

const biggestElf = totalElves.reduce((accumulator: number, item) => {
  if (accumulator < item) {
    accumulator = item;
  }
  return accumulator;
});

console.log(biggestElf);
