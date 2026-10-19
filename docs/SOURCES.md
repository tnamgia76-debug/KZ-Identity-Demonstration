# Source register and claim verification

Prepared for Nguyễn Hữu Anh's research and content assignment on 2026-10-20. This is a source audit of the existing demo, prepared with AI assistance and awaiting the member's review. The report uses S1–S11, E1 and H1 consistently. Do not cite this AI-assisted synthesis as a substitute for the primary sources below.

## Citation policy from the supplied handout

- Section 4 requires at least **three primary sources**, not three papers exclusively.
- Topic 5 names official project docs and the underlying Groth16 or PLONK paper as starter sources. For this demo, use Semaphore docs and **Groth16**, since the installed implementation calls Groth16.
- Official docs, specifications, research papers and source code qualify. News, chatbot answers and informal summaries do not replace primary sources.
- The Sources slide must include **title, author or organisation, URL and access date**. Add source citations near technical claims; source-specific sections or function names make the claims defensible.
- Different mirrors of Groth's paper are **one work**. Different files of the same upstream repository are implementation locators, not independent research papers.

## Bibliography

All web sources were accessed **2026-10-20**. The starting project revision was `ee19f1d00f7ed9777d068ef965915d9d97830ed3`.

| ID | Title and author or organisation | Primary URL | Exact locator and intended use |
|---|---|---|---|
| S1 | What Is Semaphore? — Semaphore Protocol / PSE | https://docs.semaphore.pse.dev/ | Overview; Trusted Setup Ceremony. Handout starter source. |
| S2 | On the Size of Pairing-based Non-interactive Arguments — Jens Groth, EUROCRYPT 2016, LNCS 9666, pp. 305–326 | https://eprint.iacr.org/2016/260 | Introduction; §2.2 definitions; §3.2 construction. DOI https://doi.org/10.1007/978-3-662-49896-5_11 . Handout starter paper. |
| S2 mirror | Author accepted version of the same paper — Jens Groth / UCL Discovery | https://discovery.ucl.ac.uk/1501201/1/Groth_SNARK9.pdf | Read full text through the web PDF reader; §3.2 is PDF pp. 16–17. Same work as S2, not another paper. |
| S3 | Identity implementation — Semaphore Protocol, v4.14.4 | https://github.com/semaphore-protocol/semaphore/blob/v4.14.4/packages/identity/src/index.ts | Constructor derives secret scalar, public key, commitment; commitment = poseidon2(publicKey). |
| S4 | Group implementation — Semaphore Protocol, v4.14.4 | https://github.com/semaphore-protocol/semaphore/blob/v4.14.4/packages/group/src/index.ts | Group uses LeanIMT with Poseidon, dynamic size and depth. |
| S5 | Semaphore circuit — Semaphore Protocol, v4.14.4 | https://github.com/semaphore-protocol/semaphore/blob/v4.14.4/packages/circuits/src/semaphore.circom | Semaphore template; BabyPbk; BinaryMerkleRoot; Poseidon([scope, secret]); dummySquare. |
| S6 | Proof generation — Semaphore Protocol, v4.14.4 | https://github.com/semaphore-protocol/semaphore/blob/v4.14.4/packages/proof/src/generate-proof.ts | generateProof; default artifact version 4.13.0; groth16.fullProve; packGroth16Proof. |
| S6a | Hash conversion — Semaphore Protocol, v4.14.4 | https://github.com/semaphore-protocol/semaphore/blob/v4.14.4/packages/proof/src/hash.ts | Keccak256 of 32-byte value, shifted right 8 bits. |
| S6b | Input conversion — Semaphore Protocol, v4.14.4 | https://github.com/semaphore-protocol/semaphore/blob/v4.14.4/packages/proof/src/to-bigint.ts | String scope uses encodeBytes32String then integer conversion. |
| S7 | Proof verification — Semaphore Protocol, v4.14.4 | https://github.com/semaphore-protocol/semaphore/blob/v4.14.4/packages/proof/src/verify-proof.ts | groth16.verify over root, nullifier, hash(message), hash(scope); no chain query or spent-nullifier state. |
| S8 | Semaphore contract — Semaphore Protocol, v4.14.4 | https://github.com/semaphore-protocol/semaphore/blob/v4.14.4/packages/contracts/contracts/Semaphore.sol | validateProof tracks nullifiers per group; verifyProof checks roots and supports retained old roots; _hash. Not independently matched to deployed bytecode. |
| S9 | Deployed contracts — Semaphore Protocol | https://docs.semaphore.pse.dev/deployed-contracts | Current Sepolia list differs from the historical demo address. |
| S10 | KZ Identity Demonstration — project group / tnamgia76-debug | https://github.com/tnamgia76-debug/KZ-Identity-Demonstration/tree/ee19f1d00f7ed9777d068ef965915d9d97830ed3 | Existing scripts, contract, README, lockfile and proof. Primary evidence about this demo. |
| S11 | Semaphore V4 Specification — editor Vivian Plasencia; contributors Andy, Cedoor, Oskar Thoren | https://github.com/ethereum/access-layer-specs/blob/main/specs/3-semaphore-v4/README.md | Draft specification; Identity, Group, Circuit Design, Security Considerations. Official docs link redirects from the earlier zkspecs path. |

**E1 — internal evidence.** Project group, *Blockchain Demo Step by Step*, supplied as `Blockchain-Demo-Step-by-Step.docx`. Received for review 2026-10-20; original capture dates not independently established. No public original-document URL was supplied. See [SNAPSHOTS.md](SNAPSHOTS.md) for extracted original assets and hashes. A transaction hash transcribed from an image is not itself a fresh explorer verification.

**H1 — course requirement.** Instructor, *Seminar Handout — Topics, Starter Sources & Process*, supplied as `seminar-topics-26.md`, marked links checked 09/2026. Reviewed 2026-10-20. Sections 1, 3–5, Topic 5 and Section 7. No public original-document URL was supplied.

## Claim to evidence matrix

| Claim in report | Source or observation | Verification and qualification |
|---|---|---|
| This is anonymous membership signaling | S1; S10 setup and vote | YES/NO is public; do not call this encrypted secret-ballot voting. |
| Identity construction is V4 EdDSA/Baby Jubjub based | S3; installed package lock 4.14.4 | Do not replace it with a V3 trapdoor/nullifier formula. |
| Local group root matches the supplied historical on-chain root image | S10 proof.json; rerun script 02; E1 image19 | Root equality established across these artifacts; live chain state not read. |
| Private witness includes secret and membership path | S5; S6 | Public membership lists can allow computation of possible paths; ZK hides which path was used. |
| Same identity and same scope yield same nullifier | S5; S6a; script 04 rerun | The circuit uses **hashed/processed scope**, not raw JS text. |
| Changing scope changes the nullifier and produces another valid local proof | supplemental_checks.json | Off-chain verification observed; additional on-chain vote not attempted. |
| Proof system is Groth16 | S6 fullProve; S7 verify; S2 | Three group elements in the paper; eight packed coordinates in JSON are different quantities. |
| Trusted setup is required by this proof-system choice | S2 §3.2; S1 setup section | Group did not run a ceremony; transcript and zkey hashes not audited here. |
| Local verification does not stop replay | S7 | Stateful nullifier rejection occurs in validateProof, not standalone verifyProof. |
| Duplicate screenshot matches the nullifier-used error | E1 image2; S8; local selector calculation | 0x208b15e8 equals keccak256 of Semaphore__YouAreUsingTheSameNullifierTwice() first four bytes. Screenshot is estimateGas failure, not a mined revert receipt. |
| Historical proving-time observation is 1.199 seconds | E1 image36 | One original run; machine metadata unknown. README range 0.4–0.9 is not established by this image. |
| Review rerun proving time is 1.581 seconds | evidence/local_rerun.json, script 03 | One macOS arm64 run, Node 24.19.0; not averaged with the historical run. |
| Historical vote consumed 490380 gas | E1 image9 | Whole vote transaction cost shown by Remix, not isolated Groth16 verifier gas. |
| addMember is unrestricted | S10 NEUAnonymousVoting.sol, addMember | Wrapper can be called by anyone although it is admin at Semaphore. |
| Election scope is not enforced | S10 vote | Caller-controlled scope; counters aggregate all scopes. Static finding plus changed-scope local proof test. |
| Invalid vote value may consume a nullifier without adding a vote | S10 vote | No require for 0/1 before validateProof; inferred from code, not tested on-chain. |
| Public seeds undermine real privacy | S10 setup; S3; S5 | Anyone can reconstruct demo identities and map candidate nullifiers; sample is for reproducibility. |
| npm start is not an available entry point | S10 package.json and file list | It refers to absent demo.js; invoke existing scripts directly. |

## Status of external chain verification

The review attempted the app address and transaction page in the web reader and read-only `eth_getCode` through two public Sepolia RPC endpoints. No usable live chain response was obtained; RPC requests returned HTTP 403. No new transaction was sent, no wallet was connected and no deployment was changed.

- Historical app address from E1: `0x25fBB307A9bb19757eB5647517e28328D09502a4`.
- Historical Semaphore address from the group material: `0x8A1fd199516489B0Fb7153EB5f075cDAC83c693D`.
- Current S9 documentation listed Sepolia Semaphore: `0xC10E5102A2Cc077BE3B9740Fc0Ad7e27Ff8E0245` on access.
- Historical vote tx transcribed from E1: [0x73b0ceaf…1261433](https://sepolia.etherscan.io/tx/0x73b0ceaf931ab40900286e04269fba29e09abdc9934cba0d9d74da3111261433).

## Copyable Sources slide entries

1. Jens Groth. *On the Size of Pairing-based Non-interactive Arguments.* IACR ePrint 2016/260; EUROCRYPT 2016. https://eprint.iacr.org/2016/260 (accessed 2026-10-20).
2. Semaphore Protocol / PSE. *What Is Semaphore?* V4 documentation. https://docs.semaphore.pse.dev/ (accessed 2026-10-20).
3. Semaphore Protocol. *Semaphore source code*, v4.14.4, circuit, proof and contracts packages. https://github.com/semaphore-protocol/semaphore/tree/v4.14.4 (accessed 2026-10-20).
4. Vivian Plasencia et al. *Semaphore V4 Specification*, draft. https://github.com/ethereum/access-layer-specs/blob/main/specs/3-semaphore-v4/README.md (accessed 2026-10-20).

For the strongest citation practice, show the relevant short reference on the slide containing the claim, and keep the full entry on Sources. Do not describe different files as independent papers to inflate the source count.
