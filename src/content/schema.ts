export type SourceKind = "intel" | "ietf";

export interface Source {
  id: string;
  title: string;
  organization: "Intel" | "IETF";
  kind: SourceKind;
  url: string;
  accessedAt: string;
}

export interface Claim {
  id: string;
  title: string;
  explanation: string;
  sourceIds: readonly string[];
}

export type RoleId =
  | "attester"
  | "verifier"
  | "relying-party"
  | "endorser"
  | "reference-value-provider"
  | "policy-owner"
  | "trusted-domain"
  | "guest-agent"
  | "container"
  | "pcs"
  | "pccs"
  | "key-broker";

export type RolePlane = "workload" | "attestation" | "control" | "collateral";

export interface Role {
  id: RoleId;
  label: string;
  plane: RolePlane;
  description: string;
  policyOwner: boolean;
}

export type ArtifactId =
  | "attestation-request"
  | "attestation-evidence"
  | "tdx-quote"
  | "collateral"
  | "attestation-result"
  | "key-release-request"
  | "key-release-response"
  | "workload-key";

export interface RoleEdge {
  id: string;
  from: RoleId;
  to: RoleId;
  label: string;
  description: string;
  artifact: ArtifactId;
  plane: RolePlane;
  claimIds: readonly string[];
}

export type SequenceModel = "passport" | "background-check" | "tdx-key-release";
export type SequenceBranch = "always" | "allow" | "deny";

export interface SequenceStep {
  id: string;
  from: RoleId;
  to: RoleId;
  label: string;
  detail: string;
  artifact: ArtifactId;
  branch: SequenceBranch;
  claimIds: readonly string[];
}

export interface Sequence {
  id: string;
  model: SequenceModel;
  label: string;
  description: string;
  steps: readonly SequenceStep[];
}
