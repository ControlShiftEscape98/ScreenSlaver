---
name: home-assistant-integrations
description: Builds, tests, and reviews robust Home Assistant integrations following official architectural standards.
---

# Home Assistant Integrations Expert

## Overview
This skill provides the knowledge and standards required to develop high-quality Home Assistant integrations. It ensures compliance with the core architecture and quality scales.

## Allowed Tools
- `home-assistant/core` (development environment)
- `pytest` (for integration testing)

## Triggers
- Designing new Home Assistant integrations.
- Reviewing existing integrations for architectural compliance.
- During technical migrations of Home Assistant components.

## Workflow: Standard Integration Structure
Every integration must follow this structure:
- `manifest.json`: Define integration metadata (domain, name, dependencies).
- `__init__.py`: Component setup and entry points.
- `config_flow.py`: Implementation of the user configuration UI.
- `sensor.py`, `light.py`, etc.: Platform-specific implementations.
- `strings.json`: Localizable strings for the UI.

## Standards
- Adherence to the Great Migration standards.
- Ensuring integration is compliant with the official Home Assistant Quality Scale.
