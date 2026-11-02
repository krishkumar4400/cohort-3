import rl from "readline/promises";

const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export default readline;
