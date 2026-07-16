export type ComparisonModel = "passport" | "background-check";

export interface ComparisonAxis {
  id: "boundary-artifact" | "attestation-result-path" | "verification-policy-owner" | "freshness" | "result-reuse";
  label: string;
  passport: string;
  backgroundCheck: string;
}

/** RFC 9334의 두 전달 모델을 같은 판단 축에서 비교한다. */
export const comparisonAxes = [
  {
    id: "boundary-artifact",
    label: "경계 아티팩트",
    passport: "Attester가 Verifier가 만든 Attestation Result를 보관해 Relying Party에 제시합니다.",
    backgroundCheck: "Relying Party가 Attester의 Evidence가 아니라 Verifier의 결과 조회 경계를 사용합니다.",
  },
  {
    id: "attestation-result-path",
    label: "Attestation Result 경로",
    passport: "Verifier → Attester → Relying Party",
    backgroundCheck: "Verifier → Relying Party (조회 응답)",
  },
  {
    id: "verification-policy-owner",
    label: "검증·정책 소유자",
    passport: "Verifier가 Evidence를 평가하고, Policy Owner의 기준을 결과 해석에 적용합니다.",
    backgroundCheck: "Verifier가 Evidence를 평가하고, Relying Party는 조회한 결과에 자신의 접근 정책을 적용합니다.",
  },
  {
    id: "freshness",
    label: "신선성",
    passport: "제시된 결과의 발급 시각·만료와 요청 nonce 결합을 정책으로 확인해야 합니다.",
    backgroundCheck: "조회 시점에 Verifier가 결과의 유효 기간과 재평가 정책을 적용할 수 있습니다.",
  },
  {
    id: "result-reuse",
    label: "결과 재사용",
    passport: "동일 결과를 여러 Relying Party에 제시할 수 있으므로 audience·수명 제한이 중요합니다.",
    backgroundCheck: "Relying Party별 조회를 분리하기 쉬우나, Verifier의 조회·보관 정책이 재사용 범위를 정합니다.",
  },
] as const satisfies readonly ComparisonAxis[];
