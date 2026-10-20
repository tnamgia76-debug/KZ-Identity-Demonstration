# ZK Identity Demo with Semaphore

A compact demo of **anonymous group membership and voting** using Semaphore V4, Node.js, Solidity, Remix, MetaMask, and Ethereum Sepolia.

> Prove that a user belongs to a group without revealing which member they are.

The demo also shows how a **nullifier** prevents the same anonymous user from voting twice in the same scope.

---

## Demo Flow

```text
Create identities A/B/C
        ↓
Create Semaphore group
        ↓
Generate ZK proof locally
        ↓
Export proof.json
        ↓
Deploy voting contract on Sepolia
        ↓
Add the same A/B/C commitments on-chain
        ↓
Local Merkle Root = On-chain Merkle Root
        ↓
Submit proof → Vote accepted
        ↓
Submit same proof again → Rejected
```

---

## Setup

```bash
git clone https://github.com/tnamgia76-debug/KZ-Identity-Demonstration.git
cd KZ-Identity-Demonstration
npm install
```

Requirements: **Node.js, Git, MetaMask, Remix IDE, and a small amount of Sepolia test ETH.**

---

## Off-chain Demo

Run:

```bash
node 01_identity.js
node 02_group.js
node 03_generate_proof.js
node 04_nullifier_test.js
node 05_nonmember_test.js
```

- `01_identity.js` — creates Student A/B/C and their **identity commitments**.
- `02_group.js` — creates the local Semaphore group and Merkle root.
- `03_generate_proof.js` — generates and locally verifies the ZK proof, then exports `proof.json`.
- `04_nullifier_test.js` — shows that the same identity + same scope gives the same nullifier.
- `05_nonmember_test.js` — shows that an outsider cannot prove group membership.

Expected:

```text
Proof valid: true
```

Current Merkle Root:

```text
6498286868080503464706567261660316009394353363423272750810098232448081721079
```

---

## On-chain Demo

1. Open Remix and compile `NEUAnonymousVoting.sol`.
2. Connect MetaMask to **Sepolia** (`Chain ID: 11155111`).
3. Deploy using the Semaphore V4 address:

```text
0x8A1fd199516489B0Fb7153EB5f075cDAC83c693D
```

4. Add members in the same order:

```text
Student A → Student B → Student C
```

5. Check:

```text
getGroupSize()  → 3
getGroupDepth() → 2
getGroupRoot()  → must match the local root
```

Matching roots confirm that the local proof belongs to the same group stored on-chain.

---

## Submit the Vote

Open `proof.json` and pass these values into `vote()`:

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
message = 1 → YES
```

Expected:

```text
yesVotes: 0 → 1
```

Submit the same proof again:

```text
Second vote → REJECTED
yesVotes remains 1
```

This demonstrates anonymous double-vote prevention.

---

## Results

| Test | Result |
|---|---|
| Local proof verification | PASS |
| Local root = on-chain root | MATCH |
| Anonymous vote | PASS |
| Duplicate vote | REJECTED |
| Non-member proof | REJECTED |
| Vote transaction gas | **490,380 gas** |
| Proof generation time | **~0.4–0.9 s** |

Current demo contract:

```text
0x25fBB307A9bb19757eB5647517e28328D09502a4
```

To reopen it later, compile the contract in Remix, connect to Sepolia, then use **Add Contract / At Address**.

---

## Notes

This is an educational proof-of-concept, not a production voting system.

Do not commit real private keys, seed phrases, wallet mnemonics, identity secrets, or `.env` files.

## References

- Semaphore Docs: https://docs.semaphore.pse.dev
- Semaphore GitHub: https://github.com/semaphore-protocol/semaphore
- Groth16: https://eprint.iacr.org/2016/260
