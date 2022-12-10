import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
import { _format } from "https://deno.land/std@0.165.0/path/_util.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

const instructions = input.split(/\r\n/);
let cycle = 1;
let x = 1;
let instructionIndex = 0;

const instructionTimings = {
  noop: 1,
  addx: 2,
};

let currentInstruction:
  | {
      id: string;
      instruction: "noop" | "addx";
      finishAt: number;
      V?: number;
    }
  | undefined;

let lastCycle = 1;

const cycle_value = [0];

while (cycle <= lastCycle) {
  // execute current action;
  if (currentInstruction?.finishAt == cycle) {
    if (currentInstruction?.instruction == "addx" && currentInstruction.V) {
      x = x + currentInstruction.V;
    }

    currentInstruction = undefined;
  }

  // log cycle-value;
  cycle_value[cycle] = x;

  // queue next action;
  if (instructions[instructionIndex] && currentInstruction == undefined) {
    const [instruction, value] = instructions[instructionIndex].split(" ") as [
      "noop" | "addx",
      string
    ];
    instructionIndex++;
    currentInstruction = {
      id: `${instruction}_queued_at_cycle_${cycle}`,
      instruction: instruction,
      finishAt: cycle + instructionTimings[instruction],
      V: parseInt(value),
    };

    if (lastCycle < cycle + instructionTimings[instruction]) {
      lastCycle = cycle + instructionTimings[instruction];
    }
  }

  cycle++;
}

let result = 0;

for (let index = 20; index <= cycle_value.length; index += 40) {
  result = result + index * cycle_value[index];
  console.log(index, cycle_value[index], index * cycle_value[index]);
}

console.log(result);
