# FPX Lead Journey Lab: Supabase cutover

This change affects **only** `/internal/lead-journey-lab` and its API. The
public FPX marketing pages and Softr app remain separate.

## Server configuration (Vercel, Preview environment first)

Set these **server-only** variables in the **fpx-marketing/fpx-website** Vercel project:

| Name | Value |
| --- | --- |
| `LJL_DATA_BACKEND` | `supabase` |
| `SUPABASE_URL` | `https://myinbqrflocarwzsqfef.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | FPX project's secret legacy **service_role** key, copied directly into Vercel |

Do **not** create `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`, and do not commit
any private key to GitHub or share the key in chat.

The default backend remains Airtable until the feature flag is set.
Supabase-only validation is mandatory before enabling the flag in Production.

## Migrated data, 2026-09-28

The owner-supplied Airtable CSV export has already been imported into the
separate FPX Supabase project. Validated counts:

- 15 journeys (the archived and active "Website Lead" entries stay distinct)
- 6 stages
- 163 library cards
- 138 canvas cards
- 139 connections
- 4 change-log entries
- 0 version records, 0 saved snapshots, 0 user-edited sequence-template records in source

The 0-history tables are intentional; default sequence templates are still
built into the web application. Raw CSV row data is preserved in
`raw_export` on the imported Supabase records. CSV files contained no
original Airtable record IDs; they were assigned stable deterministic IDs
during import.

**Review before Airtable re-sync:** 28 Card Library applicability entries
in the source CSV refer only to "Website Lead", which appears twice.
Their source text is preserved in `raw_export`. Do not guess or bulk relink.

**Important:** This branch does not enable two-way Airtable synchronization.
Airtable stays an archival source until original Airtable record IDs are
retrieved and the ambiguous links have been reconciled. Supabase is the
primary live writer after cutover. If it fails, API operations fail closed;
there is no silent local-only or stale-AirTable write fallback.

## Verification steps

1. Deploy `feat/lead-journey-supabase` to Vercel Preview after setting the
   Preview environment variables and redeploying.
2. Log in to the **preview URL**, not production, with an approved
   Lead Journey Lab team identity.
3. Authenticated `GET /api/internal/lead-journey-lab?section=health`
   should return `provider: supabase` and counts above.
4. Inspect Main View, Website Lead, We Search and They Find Us.
5. In a disposable QA journey: add card, connect, move, edit, duplicate a
   sequence, save a version and restore it. Refresh to verify persistence.
6. Test simultaneous browsing in two different named sessions. Test stale
   AI-source-save conflict protection. Verify archived journeys stay hidden.
7. After approval, add the same environment variables to Production,
   promote the tested commit and redeploy. Keep the original Airtable base
   unchanged as an archive.

The SQL import and its mapping are intentionally **not** published to this
public GitHub repository because they contain internal FPX journey data.
