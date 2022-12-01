// In the example above, the top three Elves are the fourth Elf (with 24000 Calories), then the third Elf (with 11000 Calories), then the fifth Elf (with 10000 Calories). The sum of the Calories carried by these three elves is 45000.

// Find the top three Elves carrying the most Calories. How many Calories are those Elves carrying in total?

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

const biggestElves = [0, 0, 0];
totalElves.forEach((elf) => {
  const indexOfSmolest = biggestElves.findIndex(
    (item) => item == Math.min(...biggestElves)
  );

  console.log("smolest index =", indexOfSmolest, biggestElves);
  if (elf > biggestElves[indexOfSmolest]) {
    biggestElves[indexOfSmolest] = elf;
  }
});

let biggestElvesSum = 0;
biggestElves.forEach((item) => {
  biggestElvesSum = biggestElvesSum + item;
});

console.log(biggestElvesSum);
