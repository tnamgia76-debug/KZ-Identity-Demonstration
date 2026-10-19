import fs from "node:fs"

import {
    generateProof,
    verifyProof
} from "@semaphore-protocol/proof"

import {
    voter,
    group,
    message,
    scope
} from "./setup.js"


console.log("=== STEP 3: ZK PROOF ===")

console.log("Voter: Student B")
console.log("Message: YES")
console.log("Scope:", scope)


// --------------------------------------------------
// GENERATE PROOF
// --------------------------------------------------

console.log("\nGenerating ZK proof...")

const startTime = performance.now()

const proof = await generateProof(
    voter,
    group,
    message,
    scope
)

const endTime = performance.now()

const provingTime =
    ((endTime - startTime) / 1000).toFixed(3)


// --------------------------------------------------
// VERIFY OFF-CHAIN
// --------------------------------------------------

const isValid = await verifyProof(proof)

console.log("Proof generation time:", provingTime, "seconds")
console.log("Proof valid:", isValid)


// --------------------------------------------------
// EXPORT FOR REMIX / ON-CHAIN DEMO
// --------------------------------------------------

if (isValid) {

    fs.writeFileSync(
        "proof.json",
        JSON.stringify(
            proof,
            (_, value) =>
                typeof value === "bigint"
                    ? value.toString()
                    : value,
            2
        )
    )

    console.log("Proof exported: proof.json")
}
// Close the CLI script.
process.exit(0)