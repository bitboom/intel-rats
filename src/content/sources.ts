import type { Source } from "./schema";

/** 권한 판단의 근거가 되는 공개 명세와 Intel 제품 문서. */
export const sources = [
  {
    id: "ietf-rfc-9334",
    title: "RFC 9334: Remote ATtestation procedureS (RATS) Architecture",
    organization: "IETF",
    kind: "ietf",
    url: "https://www.rfc-editor.org/rfc/rfc9334.html",
    accessedAt: "2026-07-16",
  },
  {
    id: "intel-tdx-overview",
    title: "Intel Trust Domain Extensions (Intel TDX) Overview",
    organization: "Intel",
    kind: "intel",
    url: "https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html",
    accessedAt: "2026-07-16",
  },
  {
    id: "intel-dcap",
    title: "Intel Data Center Attestation Primitives (Intel DCAP)",
    organization: "Intel",
    kind: "intel",
    url: "https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/data-center-attestation-primitives.html",
    accessedAt: "2026-07-16",
  },
  {
    id: "intel-pcs",
    title: "Intel Provisioning Certification Service API",
    organization: "Intel",
    kind: "intel",
    url: "https://api.portal.trustedservices.intel.com/documentation",
    accessedAt: "2026-07-16",
  },
  {
    id: "intel-pccs",
    title: "Intel SGX Provisioning Certification Caching Service",
    organization: "Intel",
    kind: "intel",
    url: "https://github.com/intel/SGXDataCenterAttestationPrimitives/tree/master/QuoteGeneration/pccs",
    accessedAt: "2026-07-16",
  },
] as const satisfies readonly Source[];

export type SourceId = (typeof sources)[number]["id"];
