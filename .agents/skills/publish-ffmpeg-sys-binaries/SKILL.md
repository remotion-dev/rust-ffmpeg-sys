---
name: publish-ffmpeg-sys-binaries
description: Install a verified seven-archive rust-ffmpeg-splitter artifact set into rust-ffmpeg-sys, regenerate bindings, validate the crate, and open a draft pull request. Use after collect-ffmpeg-artifacts completes; hand off to rust-ffmpeg only after the PR is merged to main.
---

# Publish FFmpeg Sys Binaries

Require both the absolute artifact directory and the full splitter source SHA from `$collect-ffmpeg-artifacts`.

## Guard the release input

Run from the `rust-ffmpeg-sys` repository root. Fetch `origin` and start a dedicated `agent/update-ffmpeg-binaries` branch from an up-to-date `origin/main`. If that branch or its pull request already exists, inspect it and stop rather than duplicating or rewriting it. Never rebase or force-push.

Allow this skill's own tracked `.agents/skills/publish-ffmpeg-sys-binaries` files to exist unchanged. Stop on any pre-existing change that is not explicitly part of the requested pull request.

In the artifact directory:

- require `MANIFEST.json`, `SHA256SUMS`, and exactly the seven expected `.gz` files;
- confirm `MANIFEST.json.sourceSha` equals the supplied splitter SHA;
- run `shasum -a 256 -c SHA256SUMS`;
- inspect each archive with `tar -tzf` and require `bindings.rs` plus `remotion/bin/ffmpeg` or `remotion/bin/ffmpeg.exe`.

Do not use a partial set or preserve an old archive to fill a gap.

## Replace binaries and regenerate bindings

Copy only the seven `.gz` files into `zips/`, preserving their exact names. Update `zips/SOURCE.md` with the full splitter SHA and exact GitHub Actions and CircleCI provenance from `MANIFEST.json`. Then run:

```sh
node extract-bindings.mjs
cargo fmt -- --check
cargo check
git diff --check
```

Inspect the diff. It may include the seven `zips/*.gz` archives, `zips/SOURCE.md`, and generated `bindings/*.rs` files. Do not hand-edit generated bindings. Stop if any unrelated tracked file changed.

## Commit and open a draft PR

Stage only `zips/*.gz`, `zips/SOURCE.md`, and changed `bindings/*.rs`. Commit with:

```text
Update pre-built binaries from rust-ffmpeg-splitter <short-splitter-sha>
```

Push once with `git push -u origin HEAD`. Never force-push. If the push is rejected, stop and report it instead of rewriting history.

Open a draft pull request against `main`. Include the full splitter source SHA, GitHub Actions run URL, CircleCI pipeline/workflow IDs, all seven archive names, and validation results in the body.

## Hand off to rust-ffmpeg

Report the splitter SHA, branch commit, pull request URL, and validation results. Stop until the pull request has been reviewed and merged.

After merge, fetch `origin/main`, identify the full commit on `main` containing this update, and then instruct the next agent:

```text
Open /Users/jonathanburger/Documents/GitHub/rust-ffmpeg and use
$update-rust-ffmpeg-sys with rust-ffmpeg-sys commit <full SHA>.
```

Do not edit `rust-ffmpeg` before the pull request is merged. Stop after the handoff.
