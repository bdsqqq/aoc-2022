import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

const assignmentPairs = input.split(/\r\n/).map((assignmentPair) =>
  assignmentPair.split(",").map((assignment) => {
    const [start, end] = assignment.split("-");
    return {
      start: parseInt(start),
      end: parseInt(end),
    };
  })
);

let result = 0;
assignmentPairs.forEach((assignmentPair) => {
  // if start of one of them is less or equal than end of the other, they intersect?
  // HOLY SHIT THIS WORKED?????
  if (
    assignmentPair[0].start <= assignmentPair[1].end &&
    assignmentPair[0].end >= assignmentPair[1].start
  ) {
    result = result + 1;
  }
});

console.log(result);
