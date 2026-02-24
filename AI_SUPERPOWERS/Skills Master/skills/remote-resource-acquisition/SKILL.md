---
name: remote-resource-acquisition
description: Use when receiving URLs (GitHub, Zip, Web) to acquire, extract, and ingest content into the local workspace.
---

# Remote Resource Acquisition

## Overview

A standardized workflow for fetching, extracting, and integrating remote resources into our environment. This simplifies "pulling" new skills or documentation from the internet.

## When to Use

- When a user provides a GitHub repository link.
- When a user provides a direct link to a `.zip` or `.tar.gz` file.
- When a user pointing to raw documentation or a web page to be ingested.

## Acquisition Workflows

### 1. GitHub Repositories
**Trigger**: URL contains `github.com`.

**Workflow**:
1. Check if the repo should be cloned as a submodule or a fresh copy.
2. Use `git clone --depth 1 [URL] [target_dir]`.
3. Analyze the structure (`ls -R`) to identify key folders (e.g., `skills/`, `docs/`).

### 2. Zip/Compressed Archives
**Trigger**: URL ends in `.zip`, `.tar.gz`, etc.

**Workflow**:
1. Download using `curl -L [URL] -o /tmp/resource.zip`.
2. Create a temporary extraction directory.
3. Unzip: `unzip /tmp/resource.zip -d /tmp/extracted_resource`.
4. Locate the core content and move it to the project: `mv /tmp/extracted_resource/[subdir]/* "/Users/mac/Desktop/AI_SUPERPOWERS/Skills Master/skills/"`.
5. Clean up `/tmp`.

### 3. Web Pages / Raw Docs
**Trigger**: URL points to a documentation site or blog.

**Workflow**:
1. Use `read_url_content` to fetch the markdown/text.
2. Save to a local file: `write_to_file`.
3. Use `index_brain.py` (later) to index if required.

## Tools & Commands

- **Git**: `git clone --depth 1`
- **Curl**: `curl -L -o`
- **Unzip**: `unzip`
- **FileSystem**: `mv`, `rm -rf`, `mkdir -p`

## Ingestion Guidelines

- **Skills**: Should usually go into `Skills Master/skills/[skill-name]`.
- **Docs**: Should go into `docs/` or `resources/`.
- **Temporary**: Always use `/tmp` for intermediate steps.

**MANDATORY RULE: Ask for Permission**
ALWAYS ask the user for explicit confirmation before:
- Installing any *new* skill discovered through discovery tools.
- Overwriting or updating an existing skill in the local workspace.
- Re-downloading content that appears to be already present.

## Common Mistakes

- **Not checking depth**: Always use `--depth 1` for GitHub to save time/space.
- **Polluting current dir**: Always extract to a subfolder or `/tmp` first.
- **Assuming structure**: Always run `ls -R` after extraction to see what you actually got.
