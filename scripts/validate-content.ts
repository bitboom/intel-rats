import { claims } from "../src/content/claims";
import { roles, roleEdges } from "../src/content/roles";
import { sequences } from "../src/content/sequences";
import { sources } from "../src/content/sources";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { Claim, Role, RoleEdge, Sequence, Source } from "../src/content/schema";

export interface ContentData {
  roles: readonly Role[];
  roleEdges: readonly RoleEdge[];
  sequences: readonly Sequence[];
  claims: readonly Claim[];
  sources: readonly Source[];
}

const isIsoDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
};

const duplicateIds = (label: string, ids: readonly string[], errors: string[]) => {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) errors.push(`Duplicate ${label} ID: ${id}`);
    seen.add(id);
  }
};

export function validateContent(data: ContentData = { roles, roleEdges, sequences, claims, sources }): string[] {
  const errors: string[] = [];
  const roleIds = new Set(data.roles.map((role) => role.id));
  const claimIds = new Set(data.claims.map((claim) => claim.id));
  const sourceIds = new Set(data.sources.map((source) => source.id));
  const artifactIds = new Set([
    "attestation-request", "attestation-evidence", "tdx-quote", "collateral",
    "attestation-result", "key-release-request", "key-release-response", "workload-key",
  ]);

  duplicateIds("role", data.roles.map((role) => role.id), errors);
  duplicateIds("claim", data.claims.map((claim) => claim.id), errors);
  duplicateIds("sequence", data.sequences.map((sequence) => sequence.id), errors);
  duplicateIds("role edge", data.roleEdges.map((edge) => edge.id), errors);

  const stepIds: string[] = [];
  for (const edge of data.roleEdges) {
    if (!roleIds.has(edge.from)) errors.push(`Role edge ${edge.id} references unknown sender role: ${edge.from}`);
    if (!roleIds.has(edge.to)) errors.push(`Role edge ${edge.id} references unknown recipient role: ${edge.to}`);
    for (const claimId of edge.claimIds) {
      if (!claimIds.has(claimId)) errors.push(`Role edge ${edge.id} references unknown claim: ${claimId}`);
    }
    if (!artifactIds.has(edge.artifact)) errors.push(`Role edge ${edge.id} references unknown artifact: ${edge.artifact}`);
  }

  for (const sequence of data.sequences) {
    if (sequence.steps.length === 0) errors.push(`Sequence ${sequence.id} must contain ordered steps`);
    for (const step of sequence.steps) {
      stepIds.push(step.id);
      if (!roleIds.has(step.from)) errors.push(`Step ${step.id} references unknown sender role: ${step.from}`);
      if (!roleIds.has(step.to)) errors.push(`Step ${step.id} references unknown recipient role: ${step.to}`);
      if (!artifactIds.has(step.artifact)) errors.push(`Step ${step.id} references unknown artifact: ${step.artifact}`);
      for (const claimId of step.claimIds) {
        if (!claimIds.has(claimId)) errors.push(`Step ${step.id} references unknown claim: ${claimId}`);
      }
      if (step.branch === "deny" && step.artifact === "workload-key") {
        errors.push(`Deny step ${step.id} must not release a workload-key secret`);
      }
    }

    const branches = sequence.steps.map((step) => step.branch);
    const allowIndex = branches.indexOf("allow");
    const denyIndex = branches.indexOf("deny");
    if (allowIndex === -1 || denyIndex === -1 || allowIndex >= denyIndex || denyIndex !== branches.length - 1) {
      errors.push(`Sequence ${sequence.id} must end with ordered allow then deny branches`);
    }
    if (branches.slice(allowIndex + 1).some((branch) => branch === "always")) {
      errors.push(`Sequence ${sequence.id} has an always step after its allow branch`);
    }
  }
  duplicateIds("step", stepIds, errors);

  for (const claim of data.claims) {
    if (claim.sourceIds.length === 0) errors.push(`Claim ${claim.id} must cite at least one source`);
    for (const sourceId of claim.sourceIds) {
      if (!sourceIds.has(sourceId)) errors.push(`Claim ${claim.id} references unknown source: ${sourceId}`);
    }
  }

  let previousDate = "";
  for (const source of data.sources) {
    let url: URL | undefined;
    try { url = new URL(source.url); } catch { errors.push(`Source ${source.id} has an invalid URL: ${source.url}`); }
    if (url && url.protocol !== "https:") errors.push(`Source ${source.id} must use an HTTPS URL: ${source.url}`);
    if (!isIsoDate(source.accessedAt)) {
      errors.push(`Source ${source.id} has an invalid accessedAt date: ${source.accessedAt}`);
    } else if (previousDate > source.accessedAt) {
      errors.push(`Source ${source.id} dates must be in chronological order: ${source.accessedAt} follows ${previousDate}`);
    } else {
      previousDate = source.accessedAt;
    }
  }

  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const errors = validateContent();
  if (errors.length > 0) {
    console.error("Content validation failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log("Content validation passed.");
  }
}
