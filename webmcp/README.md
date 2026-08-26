# CEPV × WebMCP — Challenge adapter v0.1

This directory contains **new WebMCP work created after the WebMCP Challenge submission window opened**. It is intentionally separated from the pre-existing CEPV implementation.

## What is preserved

The adapter does not replace or rewrite the original CEPV engine. It preserves the pre-existing CEPV sequence:

**Versioned Specialist Profile → Execution Contract → Checks → Results → Evidence → Human Validation → Evaluation → Validated Progress**

It also preserves the frozen control principles documented in the pre-challenge CEPV harness:

- required checks remain visible;
- `blocked` and `failed` are not treated as `passed`;
- findings require evidence;
- coverage is not accuracy;
- progress stays traceable;
- CHECK-008 blocks unrestricted approval while unresolved work remains;
- baseline and specialist results remain distinct;
- human adjudication is separate from agent execution.

## WebMCP behavior

The page uses the current imperative WebMCP API via `document.modelContext.registerTool(...)` and exposes six tools:

1. `cepv_get_contract`
2. `cepv_run_preflight`
3. `cepv_record_check_result`
4. `cepv_submit_candidate_finding`
5. `cepv_list_findings`
6. `cepv_export_audit_packet`

Human confirmation/rejection is **not** exposed as an agent tool. Agent-submitted findings always enter `pending_human_validation`.

If WebMCP is unavailable, the page remains usable as a normal human UI and reports that tool registration is unavailable.

## Privacy / benchmark isolation

- No API key is embedded in this static app.
- The app performs no external network calls.
- State is local to the browser via `localStorage`.
- The confirmatory ground truth and reserved source documents are not embedded in this app.
- The demo textarea explicitly asks for synthetic/public material only.

## Local test

Serve this directory from a local web server (for example `python -m http.server 8080`) and open it in a WebMCP-capable browser.

For Chrome local development, enable the WebMCP testing flag described in the current Chrome documentation.

## Challenge provenance

The public pre-existing CEPV page was committed on 2026-08-20. The challenge extension boundary is documented in repository issue #9.

This directory is development work for the challenge. A final submission should live in a dedicated public repository with a clearly visible open-source license, rather than implicitly licensing unrelated content elsewhere in this repository.
