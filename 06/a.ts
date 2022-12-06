// Find the item type that appears in both compartments of each rucksack. What is the sum of the priorities of those item types?

import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
import { _format } from "https://deno.land/std@0.165.0/path/_util.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

const datastream = input;
const start_of_packet_marker: string[] = [];
let start_of_packet_marker_index = 0;

datastream.split("").every((char, i) => {
  start_of_packet_marker.push(char);
  if (i < 3) return true; // can only have 4 unique characters after at least index 3
  if (start_of_packet_marker.length > 4) {
    start_of_packet_marker.shift();
  }

  if (start_of_packet_marker.length === new Set(start_of_packet_marker).size) {
    start_of_packet_marker_index = i + 1;
    return false; // stops the loop
  }
  return true;
});

console.log(start_of_packet_marker_index);
