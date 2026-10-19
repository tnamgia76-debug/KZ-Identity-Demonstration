import { generateProof } from "@semaphore-protocol/proof"

import {
    voter,
    group,
    message,
    scope
} from "./setup.js"


console.log("=== STEP 4: NULLIFIER TEST ===")


// First vote
const firstProof = await generateProof(
    voter,
    group,
    message,
    scope
)


// Second vote:
// same identity + same scope
const secondProof = await generateProof(
    voter,
    group,
    message,
    scope
)


console.log(
    "First nullifier :",
    firstProof.nullifier
)

console.log(
    "Second nullifier:",
    secondProof.nullifier
)

console.log(
    "Same nullifier:",
    firstProof.nullifier === secondProof.nullifier
)

process.exit(0)