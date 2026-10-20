# ZK Identity Demonstration with Semaphore

A simple demonstration of **anonymous group membership and voting** using Semaphore V4, Node.js, Solidity, Remix, MetaMask, and Ethereum Sepolia.

The demo shows that a user can prove:

> “I am a valid member of this group”

without revealing which member they are.

It also demonstrates how a **nullifier** prevents the same anonymous identity from voting twice in the same scope.

---

## 1. Demo Overview

The demo has two parts:

### Off-chain
Node.js is used to:
- create Semaphore identities,
- create a group,
- build the Merkle tree,
- generate and verify a ZK proof,
- test the nullifier,
- test a non-member.

### On-chain
Solidity + Semaphore V4 are used to:
- create the same group on Sepolia,
- add the same identity commitments,
- compare the Merkle root,
- verify the ZK proof,
- count the anonymous vote,
- reject a duplicate vote.

Main flow:

```text
Identity
  ↓
Identity Commitment
  ↓
Semaphore Group
  ↓
Merkle Root
  ↓
Generate ZK Proof
  ↓
proof.json
  ↓
Deploy contract on Sepolia
  ↓
Add the same members on-chain
  ↓
Local Root = On-chain Root
  ↓
Submit proof
  ↓
Vote accepted
  ↓
Submit same proof again
  ↓
Vote rejected
```

---

## 2. Requirements

Install:

- Node.js
- Git
- MetaMask
- A browser
- Remix IDE: https://app.remix.live

You also need a small amount of **Sepolia test ETH** for deployment and transactions.

---

## 3. Download the Project

Clone the repository:

```bash
git clone https://github.com/tnamgia76-debug/KZ-Identity-Demonstration.git
```

Enter the project folder:

```bash
cd KZ-Identity-Demonstration
```

Install dependencies:

```bash
npm install
```

Purpose: install the Semaphore packages and other Node.js dependencies required by the demo.

---

# 4. Off-chain Demo

## Step 1 — Create Identities

Run:

```bash
node 01_identity.js
```

Purpose:
- creates Student A, B, and C,
- prints their public identity commitments.

Only the commitments are public. The private identity remains hidden.

---

## Step 2 — Create the Semaphore Group

Run:

```bash
node 02_group.js
```

Purpose:
- adds A, B, and C to a local Semaphore group,
- creates the Merkle tree,
- prints the group size and Merkle root.

Expected group size:

```text
3
```

Current demo Merkle root:

```text
6498286868080503464706567261660316009394353363423272750810098232448081721079
```

This root represents the current group state.

---

## Step 3 — Generate the ZK Proof

Run:

```bash
node 03_generate_proof.js
```

Purpose:
- uses Student B as the anonymous voter,
- generates a ZK membership proof,
- verifies the proof locally,
- exports the proof to `proof.json`.

Expected result:

```text
Proof valid: true
```

Important values exported to `proof.json`:

```text
merkleTreeDepth
merkleTreeRoot
nullifier
message
scope
points
```

These values will later be passed to the Solidity `vote()` function.

---

## Step 4 — Test the Nullifier

Run:

```bash
node 04_nullifier_test.js
```

Purpose:
- generates proofs using the same identity and the same scope,
- checks whether they produce the same nullifier.

Expected result:

```text
Same nullifier: true
```

This is what allows the application to detect a repeated vote without revealing the voter’s identity.

---

## Step 5 — Test a Non-member

Run:

```bash
node 05_nonmember_test.js
```

Purpose:
- creates an outsider identity,
- checks whether an identity outside the group can generate a membership proof.

Expected result:

```text
Outsider cannot prove group membership
```

---

# 5. On-chain Demo

## Step 1 — Open Remix

Open:

```text
https://app.remix.live
```

Create or open:

```text
NEUAnonymousVoting.sol
```

Purpose: this contract connects the voting application to the Semaphore V4 contract.

---

## Step 2 — Compile the Contract

Open **Solidity Compiler** and compile `NEUAnonymousVoting.sol`.

Purpose: Remix needs the compiled contract ABI and bytecode before deployment.

---

## Step 3 — Connect MetaMask

Open **Deploy & Run Transactions**.

Choose:

```text
Environment: Browser Extension
Wallet: MetaMask
Network: Sepolia
```

Check that MetaMask is connected to:

```text
Sepolia
Chain ID: 11155111
```

Purpose: all demo transactions must run on the Sepolia testnet.

---

## Step 4 — Deploy the Voting Contract

Use this Semaphore V4 address as the constructor parameter:

```text
0x8A1fd199516489B0Fb7153EB5f075cDAC83c693D
```

Then click:

```text
Deploy
```

Confirm the transaction in MetaMask.

Purpose:
- deploys `NEUAnonymousVoting.sol`,
- creates a new Semaphore group on-chain.

After deployment, check:

```text
groupId
getGroupSize
```

Initial group size should be:

```text
0
```

---

## Step 5 — Add the Three Members

Copy the identity commitments printed by:

```bash
node 01_identity.js
```

Add them in the same order:

```text
Student A
Student B
Student C
```

Use:

```text
addMember(...)
```

After each successful transaction:

```text
A → size = 1
B → size = 2
C → size = 3
```

Purpose: recreate the same local Semaphore group on-chain.

---

## Step 6 — Check the On-chain Group

Call:

```text
getGroupSize
getGroupDepth
getGroupRoot
```

Expected:

```text
Group size = 3
Depth = 2
```

The on-chain root should match the local root:

```text
6498286868080503464706567261660316009394353363423272750810098232448081721079
```

Purpose: confirm that the local proof and the on-chain group represent the same membership state.

---

## Step 7 — Submit the Anonymous Vote

Before voting, check:

```text
yesVotes = 0
noVotes  = 0
```

Open `proof.json` and copy these values into `vote()`:

```text
merkleTreeDepth
merkleTreeRoot
nullifier
message
scope
points
```

In this demo:

```text
message = 1
```

means:

```text
YES
```

Submit the transaction and confirm it in MetaMask.

Expected result:

```text
yesVotes = 1
```

Purpose: verify the anonymous ZK proof on-chain and count the vote.

---

## Step 8 — Test Double Voting

Submit the exact same proof again.

Expected behavior:

```text
First vote  → accepted
Second vote → rejected
```

MetaMask may show:

```text
Gas estimation failed
execution reverted
```

After the failed second attempt:

```text
yesVotes = 1
```

Purpose: demonstrate that the nullifier prevents the same anonymous identity from voting twice in the same scope.

---

# 6. Demo Results

| Test | Result |
|---|---|
| Create A/B/C identities | PASS |
| Local group size = 3 | PASS |
| Local proof verification | `true` |
| Local root = on-chain root | MATCH |
| Anonymous YES vote | PASS |
| `yesVotes` | `0 → 1` |
| Duplicate vote | REJECTED |
| `yesVotes` after duplicate | `1` |
| Non-member proof | REJECTED |
| Successful vote transaction | **490,380 gas** |

Observed proof generation time during testing:

```text
~0.4–0.9 seconds
```

The **490,380 gas** value refers to the complete successful `vote()` transaction.

---

# 7. Reopen the Existing Contract

Closing Remix or restarting the computer does not delete the deployed contract.

To reconnect to the current demo contract:

1. Open Remix.
2. Compile `NEUAnonymousVoting.sol`.
3. Connect MetaMask to Sepolia.
4. Use **Add Contract / At Address**.
5. Enter:

```text
0x25fBB307A9bb19757eB5647517e28328D09502a4
```

The existing group and vote state will still be available.

---

# 8. Security Note

This project is an educational proof-of-concept.

Do not commit:

```text
wallet private keys
seed phrases
real identity secrets
API keys
.env files
```

The deterministic identities used in this demo are only for reproducibility and should never be reused in a real system.

---

# 9. References

Semaphore Documentation  
https://docs.semaphore.pse.dev

Semaphore Source Code  
https://github.com/semaphore-protocol/semaphore

Groth16 — Jens Groth  
https://eprint.iacr.org/2016/260
