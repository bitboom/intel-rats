import type { Claim } from "./schema";
import type { SourceId } from "./sources";

export const claims = [
  {
    id: "rats-passport",
    title: "패스포트 모델은 검증 가능한 증명서를 전달한다",
    explanation: "Attester가 Evidence를 Verifier에 보내고, Verifier가 만든 Attestation Result를 Relying Party가 정책에 사용한다.",
    sourceIds: ["ietf-rfc-9334"],
  },
  {
    id: "rats-background-check",
    title: "백그라운드 체크 모델은 Relying Party가 결과를 조회한다",
    explanation: "Relying Party는 Attester의 Evidence를 직접 신뢰하지 않고 Verifier에 appraisal을 요청해 결과를 받는다.",
    sourceIds: ["ietf-rfc-9334"],
  },
  {
    id: "tdx-quote-evidence",
    title: "TDX Quote는 TD의 측정값을 담는 Evidence다",
    explanation: "Intel TDX 환경에서 TD는 Quote를 생성해 원격 검증에 사용할 수 있다.",
    sourceIds: ["intel-tdx-overview", "intel-dcap"],
  },
  {
    id: "dcap-collateral",
    title: "검증에는 PCS 또는 PCCS의 collateral이 필요하다",
    explanation: "Verifier는 Intel PCS에서 받은 인증·폐기 정보를 직접 사용하거나 PCCS 캐시를 통해 가져와 Quote를 검증한다.",
    sourceIds: ["intel-dcap", "intel-pcs", "intel-pccs"],
  },
  {
    id: "policy-result",
    title: "정책 소유자가 Attestation Result의 허용 기준을 정한다",
    explanation: "Verifier의 appraisal 결과는 Policy Owner가 정한 허용 측정값, TCB 상태, 워크로드 정체성 정책으로 해석된다.",
    sourceIds: ["ietf-rfc-9334", "intel-dcap"],
  },
  {
    id: "deny-no-key",
    title: "거부 결과에서는 Key Broker가 키를 공개하지 않는다",
    explanation: "Attestation Result가 deny이면 Key Broker는 키 릴리스 요청을 거절하며 workload key를 전송하지 않는다.",
    sourceIds: ["ietf-rfc-9334"],
  },
] as const satisfies readonly Claim[];

export type ClaimId = (typeof claims)[number]["id"];
export type ClaimSourceId = (typeof claims)[number]["sourceIds"][number];

// 모든 claim이 sources.ts의 안정적인 식별자만 참조하도록 문서화하는 타입 별칭이다.
export type ReferencedSourceId = Extract<ClaimSourceId, SourceId>;
