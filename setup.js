import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"

// --------------------------------------------------
// DEMO IDENTITIES
// Fixed secrets are used ONLY for reproducible demo.
// Do not use this pattern for production.
// --------------------------------------------------

const studentA = new Identity("NEU_DEMO_STUDENT_A")
const studentB = new Identity("NEU_DEMO_STUDENT_B")
const studentC = new Identity("NEU_DEMO_STUDENT_C")

// --------------------------------------------------
// SEMAPHORE GROUP
// Each leaf = one identity commitment
// --------------------------------------------------

const group = new Group([
    studentA.commitment,
    studentB.commitment,
    studentC.commitment
])

// --------------------------------------------------
// VOTING DATA
// --------------------------------------------------

const voter = studentB

const message = 1
// 1 = YES
// 0 = NO

const scope = "NEU_BLOCKCHAIN_ELECTION_2026"

export {
    studentA,
    studentB,
    studentC,
    group,
    voter,
    message,
    scope
}