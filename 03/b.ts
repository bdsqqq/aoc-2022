// Find the item type that appears in both compartments of each rucksack. What is the sum of the priorities of those item types?

import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

const alphabets = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const;

type Letter = typeof alphabets[number];
const prio = (input: Letter) => {
  return alphabets.indexOf(input) + 1;
};

// OOF, bigO here is real bad lol, should probably do something better? Only check C for duplicates on A+B? What if: findIntersection receives an array, then compares the two first indexes and if there are matches, it runs the array of matches through the next index and so on?
const findIntersection = (a: Letter[], b: Letter[], c: Letter[]) => {
  const output: Letter[] = [];
  a.forEach((aChar) => {
    b.forEach((bChar) => {
      c.forEach((cChar) => {
        if (aChar === bChar && bChar === cChar && !output.includes(aChar)) {
          output.push(aChar);
        }
      });
    });
  });
  return output;
};

const rucksacks = input
  .split(/\r\n/)
  .map((rucksack) => rucksack.split("") as Letter[]);

const [list, chunkSize] = [rucksacks, 3];
// This is kind of hard to read
const groups = [...Array(Math.ceil(list.length / chunkSize))].map((_) =>
  list.splice(0, chunkSize)
);

let result = 0;
groups.forEach((group) => {
  const intersection = findIntersection(group[0], group[1], group[2]);
  if (intersection.length > 1) {
    console.log(intersection);
  }
  if (intersection.length == 0) return;
  intersection.forEach((intersectionItem) => {
    result = result + prio(intersectionItem);
  });
});

console.log(result);
