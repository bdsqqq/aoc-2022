import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
import { _format } from "https://deno.land/std@0.165.0/path/_util.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

const io = input.split("$ ");
if (io[0] == "") io.shift();

// Keep track of where you are, cd x pushes x, cd .. pops
let navStack: string[] = [];

// Create a representation of the file system where each file is a leaf
const filesystem: any = {};

io.forEach((line) => {
  const temp = line.split(/\r\n/);
  const [command, argument] = temp.shift()?.split(" ") || [
    "you tried to split somehing that can't be split",
  ];

  const output = [...temp];

  if (command == "cd") {
    if (argument == "..") {
      navStack.pop();
      return;
    }
    if (argument == "/") {
      navStack = ["/"];
      return;
    }
    navStack.push(argument);
    return;
  }

  if (command == "ls") {
    let current = filesystem;
    navStack.forEach((dir) => {
      if (current[dir] == undefined) {
        current[dir] = {};
      }
      current = current[dir];
    });

    output.forEach((thing) => {
      const temp = thing.split(" ");

      if (temp[0] == "dir") {
        current[temp[1]] = {};
        return;
      }

      if (current["files"] == undefined) {
        current.files = [];
      }

      if (temp[0] !== undefined && temp[1] !== undefined) {
        current.files.push({ name: temp[1], size: temp[0] });
      }
    });
  }
});

const sizes: any = new Map();
const fsKeys = Object.keys(filesystem);

const recurse = (key, tree, carry) => {
  tree[key]?.files.forEach((file) => {
    carry.forEach((carryKey) => {
      const prev = sizes.get(carryKey);
      if (!prev) {
        sizes.set(carryKey, 0);
      }
      sizes.set(carryKey, sizes.get(carryKey) + parseInt(file.size));
    });
  });

  const keys = Object.keys(tree[key]);
  keys.forEach((inKey) => {
    if (inKey == "files") return;
    const uniqueCarryKey = inKey + Math.random();
    recurse(inKey, tree[key], [...carry, uniqueCarryKey]);
  });
};

fsKeys.forEach((key) => recurse(key, filesystem, ["/"]));

let result = 0;
sizes.forEach((size, i) => {
  if (size <= 100000) {
    result = result + size;
  }
});

console.log(result);
