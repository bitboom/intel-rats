import { expect, test } from "@playwright/test";
import { validateContent, type ContentData } from "../scripts/validate-content";
import { claims } from "../src/content/claims";
import { roles, roleEdges } from "../src/content/roles";
import { sequences } from "../src/content/sequences";
import { sources } from "../src/content/sources";

const fixture = (): ContentData => JSON.parse(JSON.stringify({ roles, roleEdges, sequences, claims, sources })) as ContentData;

test("content validator accepts the published content", () => {
  expect(validateContent()).toEqual([]);
});

test("content validator reports actionable reference and identifier failures", () => {
  const data = fixture();
  data.roles[1].id = data.roles[0].id;
  data.sequences[0].steps[0].from = "missing-role";
  data.claims[0].sourceIds = ["missing-source"];

  expect(validateContent(data)).toEqual(expect.arrayContaining([
    "Duplicate role ID: attester",
    "Step passport-request references unknown sender role: missing-role",
    "Claim rats-passport references unknown source: missing-source",
  ]));
});

test("content validator rejects unknown artifacts, unsafe deny branches, and malformed source metadata", () => {
  const data = fixture();
  const denyStep = data.sequences[2].steps.find((step) => step.branch === "deny")!;
  data.sequences[0].steps[0].artifact = "unknown-artifact" as never;
  denyStep.artifact = "workload-key";
  data.sources[0].url = "http://example.test";
  data.sources[1].accessedAt = "2026-02-30";

  expect(validateContent(data)).toEqual(expect.arrayContaining([
    "Step passport-request references unknown artifact: unknown-artifact",
    "Deny step key-deny must not release a workload-key secret",
    "Source ietf-rfc-9334 must use an HTTPS URL: http://example.test",
    "Source intel-tdx-overview has an invalid accessedAt date: 2026-02-30",
  ]));
});

test("content validator requires ordered terminal branches and claim citations", () => {
  const data = fixture();
  data.sequences[0].steps = [...data.sequences[0].steps].reverse();
  data.claims[0].sourceIds = [];

  expect(validateContent(data)).toEqual(expect.arrayContaining([
    "Sequence passport-flow must end with ordered allow then deny branches",
    "Claim rats-passport must cite at least one source",
  ]));
});
