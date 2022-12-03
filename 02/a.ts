// What would your total score be if everything goes exactly according to your strategy guide?

import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

type move = "Rock" | "Paper" | "Scissors";

const moves: move[] = ["Rock", "Paper", "Scissors"];

const cypher = {
  A: moves[0],
  B: moves[1],
  C: moves[2],
  X: moves[0],
  Y: moves[1],
  Z: moves[2],
};

type cypheredMove = keyof typeof cypher;

const play = (p1: cypheredMove, p2: cypheredMove) => {
  const scores = {
    move: {
      Rock: 1,
      Paper: 2,
      Scissors: 3,
    },
    round: {
      lost: 0,
      draw: 3,
      won: 6,
    },
  };

  // This approach allows us to expand the list of moves, see: https://stackoverflow.com/a/17980668
  const mod = (a: number, b: number) => {
    const c = a % b;
    return c < 0 ? c + b : c;
  };

  let p1Score = 0;
  let p2Score = 0;
  const p1Move = cypher[p1];
  const p2Move = cypher[p2];

  // Add move scores
  p1Score = p1Score + scores.move[p1Move];
  p2Score = p2Score + scores.move[p2Move];

  // add round scores
  if (p1Move === p2Move) {
    p1Score = p1Score + scores.round.draw;
    p2Score = p2Score + scores.round.draw;
  }
  // I know this aint a draw, figure out who won and add the score
  if (
    mod(moves.indexOf(p1Move) - moves.indexOf(p2Move), moves.length) <
    moves.length / 2
  ) {
    p1Score = p1Score + scores.round.won;
  } else {
    p2Score = p2Score + scores.round.won;
  }

  // console.table({
  //   scores: [p1Score, p2Score],
  //   moves: [p1Move, p2Move],
  //   inputs: [p1, p2],
  // });

  return [p1Score, p2Score];
};

const validateInput = (input: string) => Object.keys(cypher).includes(input);

const rounds = input.split(/\r\n/).map((round) => round.split(" ")) as Array<
  "A" | "B" | "C" | "X" | "Y" | "Z"
>[];
const totals = [0, 0];
rounds.forEach((round) => {
  if (validateInput(round[0]) && validateInput(round[1])) {
    const scores = play(round[0], round[1]);
    totals[0] = totals[0] + scores[0];
    totals[1] = totals[1] + scores[1];
  }
});

console.log(totals);
