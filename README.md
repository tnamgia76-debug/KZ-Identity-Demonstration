# ZK Identity Demonstration with Semaphore

A Zero-Knowledge Identity demo using **Semaphore V4**, Node.js, Solidity, Remix, MetaMask, and the Ethereum Sepolia testnet.

This project demonstrates that a user can prove:

> "I am a valid member of this group"

without revealing:

> "Which member of the group I am."

The demo also shows how a **nullifier** prevents the same anonymous identity from voting twice in the same scope.

---

## 1. Demo Goal

We create three demo users:

```text
Student A
Student B
Student C
```

Each user has a Semaphore identity. Only the **identity commitment** is added to the group; the private identity stays secret.

Student B is used as the anonymous voter.

The complete flow is:

```text
Identity
  ↓
Identity Commitment
  ↓
Semaphore Group
  ↓
Merkle Tree / Merkle Root
  ↓
Generate ZK Proof locally
  ↓
proof.json
  ↓
Create the same group on Sepolia
  ↓
Local Root == On-chain Root
  ↓
Submit proof to vote()
  ↓
Semaphore validates proof
  ↓
Anonymous vote accepted
  ↓
Submit the same proof again
  ↓
Duplicate vote rejected
```

---

## 2. Architecture

### Off-chain

The Node.js side performs:

```text
Identity creation
Group creation
Merkle tree construction
ZK proof generation
Local proof verification
Nullifier test
Non-member test
```

### On-chain

The Solidity side performs:

```text
Semaphore group creation
Member registration
On-chain Merkle root storage
ZK proof verification
Anonymous vote counting
Double-vote prevention
```

Overall:

```text
                    OFF-CHAIN

 Student A ─┐
 Student B ─┼─> Identity Commitments
 Student C ─┘
                    │
                    ▼
              Semaphore Group
                    │
                    ▼
               Merkle Tree
                    │
                    ▼
             Local Merkle Root
                    │
                    ▼
            Generate ZK Proof
                    │
                    ▼
                proof.json
                    │
────────────────────┼────────────────────
                    │
                    ▼
                    ON-CHAIN
              Ethereum Sepolia
                    │
                    ▼
        NEUAnonymousVoting.sol
                    │
                    ▼
             Semaphore V4
                    │
                    ▼
           validateProof(...)
                    │
            ┌───────┴───────┐
            │               │
          VALID           INVALID
            │               │
            ▼               ▼
       Count vote          Revert
```

---

## 3. Project Files

```text
semaphore-neu-voting/
│
├── setup.js
├── 01_identity.js
├── 02_group.js
├── 03_generate_proof.js
├── 04_nullifier_test.js
├── 05_nonmember_test.js
├── proof.json
├── package.json
├── package-lock.json
└── NEUAnonymousVoting.sol
```

Main Semaphore packages:

```text
@semaphore-protocol/identity
@semaphore-protocol/group
@semaphore-protocol/proof
```

---

## 4. Installation

Clone the repository:

```bash
git clone https://github.com/tnamgia76-debug/KZ-Identity-Demonstration.git
cd KZ-Identity-Demonstration
npm install
```

Never commit real secrets such as:

```text
private keys
seed phrases
wallet mnemonics
real identity secrets
API keys
.env files
```

---

# OFF-CHAIN DEMO

## 5. Step 1 — Create Semaphore Identities

Run:

```bash
node 01_identity.js
```

The script creates three demo identities:

```text
Student A
Student B
Student C
```

Each Semaphore identity has private information. From that identity, Semaphore derives a public **identity commitment**.

Conceptually:

```text
Private Identity
      ↓
Cryptographic derivation
      ↓
Identity Commitment
```

Only the commitment is inserted into the public group.

Example:

```text
Student A → Commitment A
Student B → Commitment B
Student C → Commitment C
```

The private identity itself must remain secret.

The identities in this demo are deterministic only to make the seminar reproducible. They must not be reused as real identities.

---

## 6. Step 2 — Create the Local Semaphore Group

Run:

```bash
node 02_group.js
```

The commitments are inserted into the group in this exact order:

```text
A → B → C
```

Semaphore represents the group as a **Merkle Tree**.

Simplified view:

```text
             Merkle Root
             /         \
          Hash          Hash
         /   \          /
        A     B        C
```

Important outputs:

```text
Group size = 3
Merkle Root = ...
```

Current demo Merkle root:

```text
6498286868080503464706567261660316009394353363423272750810098232448081721079
```

The Merkle root acts like a cryptographic fingerprint of the group.

If the leaves or their order change, the root can change too.

---

## 7. Why the Merkle Root Matters

The ZK proof does not merely prove:

```text
"I know an identity."
```

It proves:

```text
"I know a private identity whose public commitment
belongs to the group represented by this Merkle root."
```

Therefore, the **local root** and the **on-chain root** must match before the local proof can be accepted by the on-chain verifier.

---

## 8. Step 3 — Generate the ZK Proof

Run:

```bash
node 03_generate_proof.js
```

Student B is the voter in this demo.

The proof generation uses:

```text
Student B identity
Semaphore group
message
scope
```

In this demo:

```text
message = 1
```

which represents:

```text
YES
```

The scope represents the context of the action, for example:

```text
NEU_BLOCKCHAIN_ELECTION_2026
```

The script generates:

```text
Merkle tree depth
Merkle tree root
Nullifier
Message
Scope
Groth16 proof points
```

It also verifies the proof locally.

Expected output:

```text
Proof valid: true
```

The generated data is exported to:

```text
proof.json
```

---

## 9. Understanding proof.json

The exported file contains:

```json
{
  "merkleTreeDepth": 2,
  "merkleTreeRoot": "...",
  "nullifier": "...",
  "message": "1",
  "scope": "...",
  "points": [...]
}
```

### merkleTreeDepth

The depth of the Merkle tree used in the proof.

For this three-member demo:

```text
merkleTreeDepth = 2
```

### merkleTreeRoot

The root representing the group used when the proof was generated.

This must match the root of the corresponding group on-chain.

### nullifier

A public value that lets the application detect repeated use by the same anonymous identity in the same scope.

The nullifier does **not** reveal whether the prover is Student A, B, or C.

### message

The application message bound to the proof.

In this demo:

```text
1 = YES
0 = NO
```

### scope

The context in which the action is unique.

The same identity can participate in another scope without using the same nullifier.

### points

The cryptographic Groth16 proof data passed to the on-chain verifier.

---

## 10. What Is Proven and What Stays Hidden?

The verifier learns:

```text
The prover owns a valid Semaphore identity
AND
the commitment belongs to the specified group
AND
the proof is valid for the supplied message and scope.
```

The verifier does **not** learn:

```text
whether the prover is Student A,
Student B,
or Student C.
```

So the verifier learns:

> "One valid group member created this proof."

but not:

> "Student B created this proof."

This is the privacy property demonstrated by the project.

---

## 11. Step 4 — Nullifier Test

Run:

```bash
node 04_nullifier_test.js
```

Two proofs are generated using:

```text
same identity
same scope
```

Expected result:

```text
Same nullifier: true
```

Conceptually:

```text
Student B
+
Election Scope
      ↓
Nullifier X
```

Repeating the same action:

```text
Student B
+
Same Election Scope
      ↓
Nullifier X
```

The application can detect the repeated action without discovering the user's real identity.

---

## 12. Step 5 — Non-Member Test

Run:

```bash
node 05_nonmember_test.js
```

An outsider identity is created:

```text
Group:
A
B
C

Outsider:
D
```

Because D's commitment is not part of the group's Merkle tree, D cannot construct the required membership witness.

Expected result:

```text
Result: outsider cannot prove group membership
```

The current implementation may show:

```text
The leaf at index '-1' does not exist in this tree
```

That means the outsider commitment was not found in the Merkle tree.

---

## 13. Off-chain Result

At this point we have demonstrated:

```text
Identity creation                PASS
Group construction               PASS
Merkle root generation           PASS
ZK proof generation              PASS
Local proof verification         PASS
Nullifier determinism            PASS
Non-member rejection             PASS
```

---

# ON-CHAIN DEMO

## 14. Network and Contracts

Network:

```text
Ethereum Sepolia
Chain ID: 11155111
```

Semaphore V4 contract used by this demo:

```text
0x8A1fd199516489B0Fb7153EB5f075cDAC83c693D
```

Current deployed demo contract:

```text
0x25fBB307A9bb19757eB5647517e28328D09502a4
```

---

## 15. NEUAnonymousVoting.sol

The Solidity contract acts as the application layer around Semaphore.

Its responsibilities are:

```text
Create a Semaphore group
Add member commitments
Read group size/depth/root
Submit ZK proofs
Validate proofs through Semaphore
Count YES / NO votes
```

Core public state:

```solidity
uint256 public groupId;
uint256 public yesVotes;
uint256 public noVotes;
```

During deployment, the constructor creates a new Semaphore group.

Conceptually:

```text
Deploy NEUAnonymousVoting
        ↓
constructor()
        ↓
Semaphore.createGroup(...)
        ↓
New on-chain Semaphore Group
```

---

## 16. Initial On-chain Group State

Immediately after deployment:

```text
getGroupSize() = 0
```

This means the group exists, but no member commitments have been added yet.

---

## 17. Add the Three Members

Add Student A's local commitment:

```text
addMember(A)
→ getGroupSize() = 1
```

Then Student B:

```text
addMember(B)
→ getGroupSize() = 2
```

Then Student C:

```text
addMember(C)
→ getGroupSize() = 3
```

The order must remain:

```text
A → B → C
```

because it must match the local group used to generate the proof.

---

## 18. Check the On-chain Merkle Tree

After adding all three members:

```text
getGroupSize() = 3
getGroupDepth() = 2
```

Read the root using:

```text
getGroupRoot()
```

Current on-chain root:

```text
6498286868080503464706567261660316009394353363423272750810098232448081721079
```

---

## 19. Local Root vs On-chain Root

This is the key bridge between the local demo and the blockchain demo.

Local root:

```text
6498286868080503464706567261660316009394353363423272750810098232448081721079
```

On-chain root:

```text
6498286868080503464706567261660316009394353363423272750810098232448081721079
```

Therefore:

```text
LOCAL ROOT
     =
ON-CHAIN ROOT
```

This means both environments represent the same group membership state.

The proof created locally can now be checked against the on-chain group.

---

## 20. Submit the Anonymous Vote

Before voting:

```text
yesVotes = 0
noVotes  = 0
```

The Solidity `vote()` function receives the six values exported from `proof.json`:

```text
merkleTreeDepth
merkleTreeRoot
nullifier
message
scope
points
```

Flow:

```text
proof.json
    ↓
vote(...)
    ↓
Semaphore.validateProof(...)
    ↓
Groth16 verification
    ↓
Valid?
```

Because:

```text
message = 1
```

a successful proof increments:

```text
yesVotes
```

Observed result:

```text
Before:
yesVotes = 0

After:
yesVotes = 1
```

The verifier accepts that **a valid member** voted, but does not learn that Student B was the voter.

---

## 21. On-chain Gas Result

The successful anonymous vote transaction consumed:

```text
490,380 gas
```

This is the cost of the complete `vote()` transaction.

It includes operations such as:

```text
proof validation
Merkle-root checks
nullifier checks
Groth16 verification
nullifier state update
vote counter update
```

Therefore, it should be described as:

> **On-chain vote transaction gas: 490,380 gas**

and not as:

> "Groth16 verification alone costs 490,380 gas."

---

## 22. Double-Vote Prevention

After the first successful vote, submit the **exact same proof** again.

The second request uses the same:

```text
identity
scope
nullifier
proof
```

Semaphore detects that the nullifier has already been used.

The second transaction is rejected.

The wallet may show:

```text
Gas estimation failed
execution reverted
```

This is expected.

After the rejected attempt:

```text
yesVotes = 1
```

It does not become 2.

Result:

```text
Vote #1
Valid anonymous member
→ ACCEPTED

Vote #2
Same anonymous identity
Same scope
→ REJECTED
```

This demonstrates anonymous double-vote prevention.

---

## 23. Why the Nullifier Matters

Without a nullifier, the verifier could preserve anonymity but would not know whether the same anonymous participant was acting repeatedly.

The nullifier provides:

```text
Privacy
+
Uniqueness within a scope
```

Conceptually:

```text
Identity Secret
       +
Scope
       ↓
Nullifier
```

The contract can ask:

```text
"Has this nullifier already been used?"
```

without asking:

```text
"Who is this person?"
```

---

## 24. Complete Demo Flow

```text
STEP 1
Create A, B, C identities
        ↓
Identity commitments

STEP 2
Create local Semaphore group
        ↓
Merkle Root

STEP 3
Student B generates ZK proof
        ↓
Proof valid = true
        ↓
proof.json

STEP 4
Same identity + same scope
        ↓
Same nullifier

STEP 5
Outsider test
        ↓
Cannot create membership proof

STEP 6
Deploy NEUAnonymousVoting on Sepolia
        ↓
Create Semaphore group

STEP 7
Add A → B → C
        ↓
Group size = 3

STEP 8
Check on-chain Merkle Root
        ↓
Local Root = On-chain Root

STEP 9
Submit Student B proof
        ↓
Semaphore validates proof
        ↓
Anonymous vote accepted
        ↓
yesVotes: 0 → 1

STEP 10
Submit same proof again
        ↓
Same nullifier detected
        ↓
Transaction rejected
        ↓
yesVotes remains 1
```

---

## 25. Demo Results

| Test | Expected | Result |
|---|---|---|
| Identity creation | A/B/C commitments created | PASS |
| Local group | 3 members | PASS |
| Local proof | Valid | PASS |
| Local/on-chain root | Match | MATCH |
| Anonymous YES vote | Accepted | PASS |
| Vote counter | 0 → 1 | PASS |
| On-chain vote gas | Measured | 490,380 gas |
| Duplicate vote | Rejected | PASS |
| Counter after duplicate | Remains 1 | PASS |
| Non-member | Cannot prove membership | PASS |

---

## 26. Public vs Private Data

### Public

```text
Identity commitments
Merkle root
Merkle tree depth
Nullifier
Message
Scope
ZK proof
```

### Private

```text
Identity secret
Which group member generated the proof
```

The verifier knows:

> "The voter is a valid member of A/B/C."

but does not know:

> "The voter is Student B."

---

## 27. Security Notes

This is an educational proof-of-concept, not a production voting system.

### Deterministic demo identities

The fixed demo identities exist only for reproducibility.

Production identities should be generated securely and randomly.

### Access control

The demo `addMember()` wrapper is intentionally simple.

A production application should restrict membership management using mechanisms such as:

```text
onlyOwner
role-based access control
governance
verified registration
```

### Application-level validation

A production voting system should additionally enforce:

```text
allowed vote values
election start/end time
registration rules
group administration
voting deadline
```

### Secret management

Never publish:

```text
wallet private keys
MetaMask seed phrases
real identity secrets
API credentials
```

---

## 28. Reopening the Deployed Contract

Restarting the computer or closing Remix does **not** delete the contract.

The contract remains on Sepolia.

To reconnect:

1. Open Remix.
2. Compile `NEUAnonymousVoting.sol`.
3. Open **Deploy & Run Transactions**.
4. Connect MetaMask.
5. Select **Sepolia**.
6. Choose **Add Contract / At Address**.
7. Enter:

```text
0x25fBB307A9bb19757eB5647517e28328D09502a4
```

The existing on-chain state remains available:

```text
group size
group root
yesVotes
noVotes
```

Do not deploy another contract unless you intentionally want a new demo instance.

---

## 29. Seminar Interpretation

### What is being proven?

The prover demonstrates membership in a known Semaphore group.

### What stays hidden?

Which specific group member created the proof.

### What prevents double voting?

The Semaphore nullifier.

### Where is the proof generated?

Off-chain using Node.js and Semaphore.

### Where is it verified?

On-chain through Semaphore on Sepolia.

### Which proof system is used?

Semaphore V4 uses Groth16-based proofs.

### Observed proving time

During testing, proof generation took approximately:

```text
~0.4–0.9 seconds
```

depending on the run and local machine.

A formal benchmark should use multiple runs rather than one measurement.

### Observed on-chain cost

```text
490,380 gas
```

for the successful anonymous vote transaction.

---

## 30. Why This Demo Matters

Traditional blockchain applications often expose an address directly through transaction history.

Semaphore demonstrates a different model:

```text
Private Identity
       ↓
ZK Proof
       ↓
Prove Membership
       ↓
Perform Valid Action
       ↓
Identity Remains Hidden
```

The blockchain can enforce:

```text
valid membership
one action per scope
application rules
```

without requiring the application to know the real identity of the participant.

---

## 31. References

### Semaphore Documentation
https://docs.semaphore.pse.dev

### Semaphore Source Code
https://github.com/semaphore-protocol/semaphore

### Groth16
Jens Groth, **On the Size of Pairing-based Non-interactive Arguments**

https://eprint.iacr.org/2016/260

### Ethereum Sepolia
Ethereum test network used for the on-chain demonstration.

---

## 32. Disclaimer

This repository is for educational and seminar demonstration purposes.

The identities, contract logic, and voting flow are simplified to make the Zero-Knowledge Identity mechanism easier to observe and explain.

It should not be used directly as a production identity or voting system.
