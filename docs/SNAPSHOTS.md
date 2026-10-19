# Demo snapshot provenance

All 14 demo PNGs below are **byte-for-byte original embedded images** extracted from the user-supplied `Blockchain-Demo-Step-by-Step.docx`. No screenshot was generated, redrawn, retouched or presented as a fresh UI capture. Extraction and inspection: **2026-10-20**. Original capture dates are not established. The additional architecture figure is a new explanatory diagram, not a screenshot.

| Report asset | Original DOCX media | Observation | SHA256 |
|---|---|---|---|
| [01_identities.png](assets/demo/01_identities.png) | `word/media/image33.png` | Ba identity commitments | `7370865a0655a3c59d91faacfa4310111472354b5f31b89595bc23db205b04ac` |
| [02_group.png](assets/demo/02_group.png) | `word/media/image22.png` | Nhóm ba thành viên và Merkle root | `e1e5a30bb3d2568bccfa15abe1ee40a6bb4c5e0b7f8a0c415c8db27b01dba7a9` |
| [03_proof.png](assets/demo/03_proof.png) | `word/media/image36.png` | Proof valid và proving time 1.199 giây | `361419d909abc0f123842bb0ed8f5bb678f833f007c2a472c90acbf2c2084398` |
| [04_proof_json.png](assets/demo/04_proof_json.png) | `word/media/image28.png` | Dữ liệu proof.json | `fa0ff776f0578d361866f77a9f55f254d562c9eee65f2fdc6ab1b367fae687b8` |
| [05_nullifier.png](assets/demo/05_nullifier.png) | `word/media/image16.png` | Hai nullifier giống nhau | `390e2023d399be9320fe93b1b187f876a076aac279b013ccebb493bb81af64d7` |
| [06_nonmember.png](assets/demo/06_nonmember.png) | `word/media/image24.png` | Outsider không có leaf trong cây | `a0bf8bb7885bcdc238a0a50eaf54c37e94fae023ee52f536067a3b85cf9040d0` |
| [07_group_size.png](assets/demo/07_group_size.png) | `word/media/image35.png` | Group size bằng ba | `83588804f8fa2cb6a55e853bf085238207cb79704316e76eca1f20a0820877f8` |
| [08_group_depth.png](assets/demo/08_group_depth.png) | `word/media/image34.png` | Group depth bằng hai | `5b8565f476f58d7465ceced9e72c3357994445c285cf2959fc4e5a84a77d96c0` |
| [09_group_root.png](assets/demo/09_group_root.png) | `word/media/image19.png` | Root on-chain trong ảnh gốc | `9a11bb74f16656161b7045ae61321c5050c7d5e79ba692050dd6ac9e4d2e9d68` |
| [10_before_vote.png](assets/demo/10_before_vote.png) | `word/media/image12.png` | yesVotes bằng không trước vote | `e9700401610a7fd1c986beb90c327553dbd71096b345dac8a80140cd3462efda` |
| [11_vote_gas.png](assets/demo/11_vote_gas.png) | `word/media/image9.png` | Giao dịch mined và 490380 gas | `0420b8558d269fe7c7e7064d8da1bf0694626e266c0ce91c40ae6013a66a6ae6` |
| [12_after_vote.png](assets/demo/12_after_vote.png) | `word/media/image17.png` | yesVotes bằng một sau vote | `bda6557a7c3bccdfd12077bad313f26151025dd955dd41bb89b0aac3dd8e0ea0` |
| [13_duplicate_error.png](assets/demo/13_duplicate_error.png) | `word/media/image2.png` | estimateGas lỗi nullifier đã dùng | `454345df6f34a6a80b369b1aa5b2e4fde968caaec545490de3fb65edd26e832b` |
| [14_after_duplicate.png](assets/demo/14_after_duplicate.png) | `word/media/image39.png` | yesVotes vẫn bằng một sau lần thử lặp | `5b7ca3c925f92d880b3f76bfb8c937055abda09c2e780de65e628333f41cd8e9` |

## Interpretation boundaries

- `03_proof.png` shows **1.199 seconds**, not the README range of 0.4–0.9 seconds.
- `11_vote_gas.png` shows **490380 gas** for the whole vote transaction, block **11942285**.
- Vote transaction hash transcribed and cross-checked between the original Remix image and the explorer image: `0x73b0ceaf931ab40900286e04269fba29e09abdc9934cba0d9d74da3111261433`.
- `13_duplicate_error.png` is an **estimateGas** failure, not evidence of a second mined transaction. Its revert data starts with `0x208b15e8`, matching the duplicate-nullifier error selector calculated locally.
- The screenshot identity labels are demo labels. The seeds are public in setup.js, so these sample identities do not provide real secrecy.
- Historical screenshots have not been promoted to a claim about current chain state. See SOURCES.md for the unsuccessful independent lookup attempts.
