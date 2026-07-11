import { createBatches } from "./utils/batch";

const numbers = [1,2,3,4,5,6,7,8,9,10];

const batches = createBatches(numbers,3);

console.log(batches);