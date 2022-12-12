import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
import { _format } from "https://deno.land/std@0.165.0/path/_util.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

const grid = input
  .split(/\r\n/)
  .map((row, x) => row.split("").map((c, y) => ({ char: c, x, y })));

const rows = grid.length;
const cols = grid[0].length;
const start = grid.flat().find((c) => c.char === "S");
const end = grid.flat().find((c) => c.char === "E");

if (start === undefined || end === undefined)
  throw new Error("No start or end found");

console.log(start, end);

const abc = ("S" + "abcdefghijklmnopqrstuvwxyz" + "E").split("");

const getLetterValue = (char: string): number => {
  if (!abc.includes(char)) throw new Error("Invalid character");
  if (char === "S") return 1;
  if (char === "E") return 26;
  return abc.indexOf(char);
};
// A queue data structure to store the nodes to visit during the BFS.
const queue = new Array<{
  char: string;
  x: number;
  y: number;
  path: number[][];
}>();

// A function to check if a given coordinate is valid and not visited before.
const isValid = (x: number, y: number, visited: boolean[][]): boolean => {
  return x >= 0 && x < rows && y >= 0 && y < cols && !visited[x][y];
};

// Initialize the visited array with all false values.
const visited = new Array(rows)
  .fill(false)
  .map(() => new Array(cols).fill(false));

// Add the start point to the queue.
queue.push({
  char: start.char,
  x: start.x,
  y: start.y,
  path: [[start.x, start.y]],
});

// Loop until the queue is empty.
while (!(queue.length === 0)) {
  // console.log(queue.map((q) => q.char).join(""));
  // Dequeue the next node from the queue.
  const current = queue.shift();
  if (current === undefined) throw new Error("Queue is empty");
  const { char, x, y, path } = current;
  if (char == "S") {
    console.log(char, grid[x][y], grid[y][x]);
  }

  // Check if we have reached the end point.
  if (char === "E") {
    console.log("found path", path.length - 1);
    console.log(path);
    break;
  }

  // Check the four possible directions (up, down, left, and right) from the current node.
  for (const [dx, dy] of [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]) {
    const nx = x + dx;
    const ny = y + dy;

    if (isValid(nx, ny, visited)) {
      // can't clib more than 1
      if (
        getLetterValue(grid[nx][ny].char) >
        getLetterValue(grid[x][y].char) + 1
      ) {
        console.log(`${grid[x][y].char} cant climb to ${grid[nx][ny].char}`);

        continue;
      } else {
        console.log(`${grid[x][y].char} CAN climb to ${grid[nx][ny].char}`);
      }

      // Mark the new coordinate as visited.
      visited[nx][ny] = true;

      // Add the new coordinate to the queue, along with the updated path.
      queue.push({
        char: grid[nx][ny].char,
        x: nx,
        y: ny,
        path: [...path, [nx, ny]],
      });
    }
  }
}
console.log("done");
