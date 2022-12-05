// Find the item type that appears in both compartments of each rucksack. What is the sum of the priorities of those item types?

import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
import { _format } from "https://deno.land/std@0.165.0/path/_util.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

const [stacksInput, instructionsInput] = input.split(/\r\n\r\n/);
const stackWidth = 3;
const stackSpacing = 1;

const layers = stacksInput
  .split(/\r\n/)
  .map((layer) =>
    [...layer]
      .filter((_, i) => (i + 1) % (stackWidth + stackSpacing) !== 0)
      .filter((_, i) => (i - 1) % stackWidth === 0)
  );
layers.pop();

const stacks: string[][] = new Array(layers[0].length);
layers.forEach((layer) => {
  layer.forEach((char, i) => {
    if (char !== " ") {
      if (!stacks[i]?.length) {
        stacks[i] = [];
      }
      stacks[i].unshift(char);
    }
  });
});

const instructions = instructionsInput
  .split(/\r\n/)
  .map((instructionString) => {
    const [_move, amount, _from, start, _to, end] =
      instructionString.split(" ");
    return {
      amount: parseInt(amount),
      start: parseInt(start),
      end: parseInt(end),
    };
  });

instructions.forEach((instruction) => {
  for (let i = 0; i < instruction.amount; i++) {
    stacks[instruction.end - 1].push(
      stacks[instruction.start - 1].pop() ||
        "I shouldn't be here, input is fucked up"
    );
  }
});

const result = stacks.map((stack) => stack.at(-1)).join("");

console.log(result);
