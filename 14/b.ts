import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
import { _format } from "https://deno.land/std@0.165.0/path/_util.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

const lines = input
  .split(/\r\n/)
  .map((line) =>
    line.split(" -> ").map((point) => point.split(",").map(Number))
  );

const pointsCoords = lines.flat();

const sandOrigin = [500, 0];

const biggestY = pointsCoords.reduce(
  (biggestY, [_, y]) => Math.max(biggestY, y),
  sandOrigin[1]
);

const biggestX = pointsCoords.reduce(
  (biggestX, [x, _]) => Math.max(biggestX, x),
  sandOrigin[0]
);

const smallestX = pointsCoords.reduce(
  (smallestX, [x, _]) => Math.min(smallestX, x),
  sandOrigin[0]
);

const totalPaddingX = 12000;
const paddingX = totalPaddingX / 2;

const extraHeight = 2;

const grid = Array.from({ length: biggestY + 1 + extraHeight }, () =>
  Array.from({ length: biggestX - smallestX + 1 + totalPaddingX }, () => ".")
);
grid[biggestY + extraHeight] = grid[biggestY + extraHeight].map(() => "#");
grid[sandOrigin[1]][sandOrigin[0] - smallestX + paddingX] = "+";

lines.forEach((line) => {
  for (let i = 0; i < line.length - 1; i++) {
    const [x1, y1] = line[i];
    const [x2, y2] = line[i + 1];

    // horizontal line
    if (y1 === y2) {
      // console.log("drawing horizontal line", x1, x2, y1);
      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        // console.log("# in", y1, x - smallestX + paddingX);
        grid[y1][x - smallestX + paddingX] = "#";
      }
    }

    // vertical line
    if (x1 === x2) {
      // console.log("drawing vertical line", x1, y1, y2);
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        // console.log("# in", y, x1);
        grid[y][x1 - smallestX + paddingX] = "#";
      }
    }
  }
});

let sand = 0;

let finished = false;
while (!finished) {
  // sand falls
  let sandPos = sandOrigin;
  let settled = false;
  while (!settled) {
    const [x, y] = sandPos;
    const down =
      grid[sandPos[1] + 1] && grid[sandPos[1] + 1][x - smallestX + paddingX];
    const downLeft = grid[y + 1] && grid[y + 1][x - smallestX + paddingX - 1];
    const downRight = grid[y + 1] && grid[y + 1][x - smallestX + paddingX + 1];

    if (
      down !== "." &&
      downLeft !== "." &&
      downRight !== "." &&
      sandPos[1] === sandOrigin[1]
    ) {
      grid[sandPos[1]][sandPos[0] - smallestX + paddingX] = "o";
      sand++;
      settled = true;
      finished = true;
      break;
    }

    if (down === ".") {
      sandPos = [sandPos[0], sandPos[1] + 1];
    } else {
      if (downLeft === ".") {
        sandPos = [sandPos[0] - 1, sandPos[1] + 1];
      } else {
        if (downRight === ".") {
          sandPos = [sandPos[0] + 1, sandPos[1] + 1];
        } else {
          grid[sandPos[1]][sandPos[0] - smallestX + paddingX] = "o";
          sand++;
          settled = true;
        }
      }
    }
  }

  if (grid[sandOrigin[1]][sandOrigin[0]] === "o") {
    console.log(sand);
    finished = true;
  }
}

// grid.map((row) => row.join("")).forEach((row) => console.log(row));
console.log(sand);
