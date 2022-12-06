import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
import { _format } from "https://deno.land/std@0.165.0/path/_util.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

const datastream = input;
const start_of_packet_marker: string[] = [];
let start_of_packet_marker_index = 0;
const keySize = 14;

datastream.split("").every((char, i) => {
  start_of_packet_marker.push(char);
  if (i + 1 < keySize) return true;
  if (start_of_packet_marker.length > keySize) {
    start_of_packet_marker.shift();
  }

  if (start_of_packet_marker.length === new Set(start_of_packet_marker).size) {
    start_of_packet_marker_index = i + 1;
    return false; // stops the loop
  }
  return true;
});

console.log(start_of_packet_marker_index);
