# Intel TDX attestation — prose v3 delivery

이 디렉터리는 passed canonical Point `v04`에서 생성한 paired To Deck delivery artifact다. 공개 Astro 사이트의 claim source를 대체하지 않으며, site content를 바꾸지 않고 검토·발표용 결과물을 보관한다.

## Canonical Point

- Reader source: [`../../point/intel-tdx-attestation-point-v04.md`](../../point/intel-tdx-attestation-point-v04.md)
- Model: [`../../point/intel-tdx-attestation-point-v04.yaml`](../../point/intel-tdx-attestation-point-v04.yaml)
- Point SHA-256: `59bb8e0d71c321cc18cb4880e27dbbe7966511257a4d4c33e7e7a538fbc38891`
- Point gate: score 92, passed

## Direct deliverables

| Artifact | Purpose | SHA-256 |
|---|---|---|
| `intel-tdx-attestation-prose-summary.pptx` | 2-slide release-control summary | `3769bba4e8865843d6f7bb0f6514314791b48c609c096554b22171c73f2c1a1c` |
| `intel-tdx-attestation-prose-structural.pptx` | 16-slide full-Point structural deck | `dee1574c2f8ccf6226fdb0b596e20a2a06319eec9b72781b3f1232f21d1a00b3` |
| `final-report.md` | build, visual QA, and independent acceptance evidence | `32051e6bd24a0409f6b3423260de7cca79891dea5aa65b00d82532cfa7f25f6d` |
| `prose-v3-gate.json` | actual PPTX semantic/coverage gate | `bd34c21d85549c11485bfa1699c50dce15ad8e718a1e00ebb7613e391cd28653` |
| `package-gate.json` | paired portable-package verification | `139c02953830bf74e01b0da96fa47b6c06e0d26b05de8e180996ef87c52536ef` |
| `intel-rats-prose-v3-review-trail.zip` | portable inputs, renderer evidence, PPTX, and review trail | `c128c7c899cd37bbc3f777626c490b9e81142b8278da1941ff0b2c8c42ae4cf4` |

## Scope

Intel-rats is a teaching/design-review lens. The deck is not a deployable verifier baseline, vendor recommendation, or production approval. The canonical package supplies stable `S-*` source markers but no bibliographic-title registry; no citation title has been inferred.
