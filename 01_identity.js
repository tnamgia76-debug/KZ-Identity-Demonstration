import {
    studentA,
    studentB,
    studentC
} from "./setup.js"

console.log("=== STEP 1: SEMAPHORE IDENTITIES ===")

console.log(
    "Student A commitment:",
    studentA.commitment.toString()
)

console.log(
    "Student B commitment:",
    studentB.commitment.toString()
)

console.log(
    "Student C commitment:",
    studentC.commitment.toString()
)