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

const findIntersection = (a: Letter[], b: Letter[]) => {
  const output: Letter[] = [];
  a.forEach((aChar) => {
    b.forEach((bChar) => {
      if (aChar === bChar && !output.includes(aChar)) {
        output.push(aChar);
      }
    });
  });
  return output;
};

const rucksacks = input
  .split(/\r\n/)
  .map((rucksack) => [
    rucksack.slice(0, rucksack.length / 2).split("") as Letter[],
    rucksack.slice(rucksack.length / 2).split("") as Letter[],
  ]);

let result = 0;
rucksacks.forEach((rucksack) => {
  const intersection = findIntersection(rucksack[0], rucksack[1]);
  if (intersection.length == 0) return;
  intersection.forEach((intersectionItem) => {
    result = result + prio(intersectionItem);
  });
});

console.log(result);
