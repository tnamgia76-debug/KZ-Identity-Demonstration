import { Identity } from "@semaphore-protocol/identity"
import { generateProof } from "@semaphore-protocol/proof"

import {
    group,
    message,
    scope
} from "./setup.js"


console.log("=== STEP 5: NON-MEMBER TEST ===")


// Outsider is NOT added to the Semaphore group.
const outsider =
    new Identity("NEU_DEMO_OUTSIDER")


try {

    await generateProof(
        outsider,
        group,
        message,
        scope
    )

    console.log("Unexpected: outsider proof was generated")

} catch (error) {

    console.log(
        "Result: outsider cannot prove group membership"
    )

    console.log(
        "Reason:",
        error.message
    )
} finally {
    
    process.exit(0)
}