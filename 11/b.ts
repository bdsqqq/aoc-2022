import * as p from "https://deno.land/std@0.165.0/path/mod.ts";
import { _format } from "https://deno.land/std@0.165.0/path/_util.ts";
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve("./input.txt"))
);

const monkeys = input
  .split(/\r\n\r\n/)
  .map((rawMonkeyInput) => rawMonkeyInput.split(/\r\n/))
  .map((splitMonkeyInput) => {
    const [_s, rawStartingItems] = splitMonkeyInput[1].split(": ");
    const startingItems = rawStartingItems
      .split(", ")
      .map((item) => parseInt(item));

    const [_o, rawOperation] = splitMonkeyInput[2].split(": ");
    // All operations follow the following formula:
    //  `new = old (operator) (value)`
    // where operator == * | + and value == number | old
    // so, splitting by "=" gives me ["new", "old (operator) (value)"]
    // then I can split [1] by " " to grab ["old", (operator), (value)]
    // which I can use in a series of conditionals/switch statements.
    const operations = rawOperation.split(" = ")[1].split(" ");

    const test = parseInt(splitMonkeyInput[3].split("Test: divisible by ")[1]);
    // All tests have the following format:
    // Test: divisible by (value), where (value) is a number
    // so I can just split one time and parse the value

    // The same as above is true for both if cases,
    // The strings are always equal so I just need to split the numbers
    const trueCase = parseInt(
      splitMonkeyInput[4].split("If true: throw to monkey ")[1]
    );
    const falseCase = parseInt(
      splitMonkeyInput[5].split("If false: throw to monkey ")[1]
    );

    return {
      items: [...startingItems],
      operations,
      test,
      trueCase,
      falseCase,
    };
  });

const rounds = 10 * 1000;
const inspects: number[] = new Array(monkeys.length).fill(0);
const divisors = monkeys.map((m) => m.test);
const lcm = divisors.reduce((acc, curr) => acc * curr, 1);

for (let index = 1; index <= rounds; index++) {
  monkeys.forEach((monkey, i) => {
    monkey.items.forEach((item) => {
      let worryLevel = item;
      if (worryLevel == undefined) return;

      // console.log(`monkey ${i} is inspecting item ${worryLevel}`);
      inspects[i]++;

      const operationValue =
        monkey.operations[2] == "old" ? item : parseInt(monkey.operations[2]);

      worryLevel =
        monkey.operations[1] == "*"
          ? worryLevel * operationValue
          : worryLevel + operationValue;

      // console.log(
      //   `monkey ${i} inspects the item, ${item} ${monkey.operations[1]} ${monkey.operations[2]} = ${worryLevel}`
      // );

      const manageable = worryLevel % lcm;

      const targetMonkey =
        manageable % monkey.test == 0 ? monkey.trueCase : monkey.falseCase;

      // console.log(`monkey ${i} is throwing ${manageable} at ${targetMonkey}`);
      monkeys[targetMonkey].items.push(manageable);
    });
    monkey.items = [];
  });
}

const first = Math.max(...inspects);
const second = Math.max(...inspects.filter((v) => v !== first));

console.log(first, second);
console.log(inspects);
console.log(first * second);
