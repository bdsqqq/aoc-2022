// Find the item type that appears in both compartments of each rucksack. What is the sum of the priorities of those item types?

import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

const assignmentPairs = input.split(/\r\n/).map((assignmentPair) =>
  assignmentPair.split(",").map((assignment) => {
    const [start, end] = assignment.split("-");
    return {
      start,
      end,
    };
  })
);

let result = 0;
assignmentPairs.forEach((assignmentPair) => {
  // Assignments are always sequential so for one to be included in another, just end and start need to be included.
  if (
    (parseInt(assignmentPair[0].start) <= parseInt(assignmentPair[1].start) &&
      parseInt(assignmentPair[0].end) >= parseInt(assignmentPair[1].end)) ||
    (parseInt(assignmentPair[1].start) <= parseInt(assignmentPair[0].start) &&
      parseInt(assignmentPair[1].end) >= parseInt(assignmentPair[0].end))
  ) {
    result = result + 1;
  }
});

console.log(result);
