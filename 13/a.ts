import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
import { _format } from "https://deno.land/std@0.165.0/path/_util.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

const packagePairs = input
  .split(/\r\n\r\n/)
  .map((packagePair) =>
    packagePair.split(/\r\n/).map((pack) => JSON.parse(pack))
  );

// type array of depth 0 or n of numbers

const compareValues = (
  left: number | number[],
  right: number | number[]
): any => {
  // THeyre both numbers
  if (typeof left == "number" && typeof right == "number") {
    if (left < right) {
      console.log(left, right, true);
      return true;
    }
    if (left > right) {
      console.log(left, right, false);
      return false;
    }
  }
  // exactly one is an integer
  if (typeof left == "number" && Array.isArray(right)) {
    left = [left];
    return compareValues(left, right);
  }
  if (typeof right == "number" && Array.isArray(left)) {
    right = [right];
    return compareValues(left, right);
  }

  // Theyre both arrays
  if (Array.isArray(left) && Array.isArray(right)) {
    const lLength = left.length;
    const rLength = right.length;

    if (lLength !== 0 || rLength !== 0) {
      if (lLength === 0) {
        console.log("left side ran out of items", true);
        return true;
      }
      if (rLength === 0) {
        console.log("right side ran out of items", false);
        return false;
      }
    }

    for (let index = 0; index < Math.max(lLength, rLength); index++) {
      const l = left[index];
      const r = right[index];
      if (l === undefined) return true;
      if (r === undefined) return false;
      const res = compareValues(l, r);
      if (typeof res !== "undefined") return res;
    }
  }
};

const results = packagePairs.map((packagePair) => {
  let [left, right] = packagePair;
  return compareValues(left, right);
});

//sum the indices of the true values
const result = results.reduce((acc, cur, index) => {
  if (cur) return acc + index + 1;
  return acc;
}, 0);

console.log(result);
