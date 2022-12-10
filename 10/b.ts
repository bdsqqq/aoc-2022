import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
import { _format } from "https://deno.land/std@0.165.0/path/_util.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

const instructions = input.split(/\r\n/);
let cycle = 1;
let x = 1;
let instructionIndex = 0;

const CRT: string[][] = [];

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

while (cycle <= lastCycle) {
  // console.log(`cycle ${cycle}`);

  // execute current action;
  if (currentInstruction?.finishAt == cycle) {
    if (currentInstruction?.instruction == "addx" && currentInstruction.V) {
      x = x + currentInstruction.V;
    }

    currentInstruction = undefined;
  }

  // draw pixel;
  const row = Math.floor((cycle - 1) / 40);
  if (CRT[row] == undefined) {
    CRT[row] = [];
  }
  // console.log(cycle, row);

  const adjustedCycle = cycle - row * 40;

  if (x == adjustedCycle - 2 || x == adjustedCycle - 1 || x == adjustedCycle) {
    CRT[row].push("#");
  } else {
    CRT[row].push(".");
  }

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

console.log(CRT.map((row) => row.join("")));
