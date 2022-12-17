// THANK YOU SO MUCH FUGI FOR HELPING ME WITH THIS ONE 😭😭

import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
import { _format } from "https://deno.land/std@0.165.0/path/_util.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

type Valve = {
  label: string;
  flowRate: number;
  ConnectedTo: string[];
};

const valves = new Map<string, Valve>();
input.split(/\r\n/).forEach((line) => {
  const [valveString, connectedToString] = line.split(";");
  const [_valve, label, _has, _flow, rateString] = valveString.split(" ");
  const flowRate = rateString.split("=")[1];

  const ConnectedTo = connectedToString
    .split(" ")
    .filter(
      (s) =>
        ![
          "",
          "tunnels",
          "tunnel",
          "lead",
          "leads",
          "to",
          "valve",
          "valves",
        ].includes(s)
    )
    .map((s) => s.replace(",", ""));
  valves.set(label, {
    label,
    flowRate: Number(flowRate),
    ConnectedTo,
  } as Valve);
});

const minutes = 30;
const startingPos = "AA";

const moves = [
  {
    pos: startingPos,
    time: 30,
    pressureReleased: 0,
    opened: new Set(),
    log: new Array<string>(),
  },
];
const seen = new Set<string>();
const finals = [];

while (moves.length > 0) {
  const current = moves.shift()!;
  const valve = valves.get(current.pos)!;

  // overshoot the time, was at 29 and added +2
  if (current.time < 0) continue;

  if (current.time === 0) {
    finals.push(current);
    continue;
  }

  if (
    seen.has(
      `${current.pos}-${current.pressureReleased}-${JSON.stringify(
        current.opened.values()
      )}`
    )
  ) {
    continue;
  }
  seen.add(
    `${current.pos}-${current.pressureReleased}-${JSON.stringify(
      current.opened.values()
    )}`
  );

  // If we don't open the valve
  for (const pos of valve.ConnectedTo) {
    moves.push({
      pos,
      time: current.time - 1,
      pressureReleased: current.pressureReleased,
      opened: current.opened,
      log: [...current.log, `move ${pos}`],
    });
  }
  // If we open the valve
  if (!current.opened.has(valve.label)) {
    const opened = new Set([valve.label, ...current.opened.values()]);
    const pressureReleased =
      current.pressureReleased + valve.flowRate * (current.time - 1);
    for (const pos of valve.ConnectedTo) {
      moves.push({
        pos,
        time: current.time - 2,
        pressureReleased,
        opened,
        log: [...current.log, `open ${valve.label}`, `move ${pos}`],
      });
    }
  }
}

finals.sort((a, b) => b.pressureReleased - a.pressureReleased);
console.log(finals[0].pressureReleased);
