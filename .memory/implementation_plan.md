# ScreenSlaver Studio — Unified Implementation Plan

> **North Star**: *"Any phone on camera runs this app. Always."*
> **Identity**: A lighting-console-level control system for digital props and screens on film sets.

---

## What We Have Today

| Layer        | Files                                    | Status     |
|-------------|------------------------------------------|------------|
| **Mode**    | `modeManager.ts`                         | ✅ Working  |
| **Session** | `sessionManager.ts`, `backend/server.js` | ✅ Working  |
| **Comms**   | `commManager.ts`                         | ✅ Working  |
| **Types**   | `types/index.ts`                         | ⚠️ Incomplete |
| **Controller UI** | `ui/ControllerDashboard.tsx`       | ⚠️ Placeholder |
| **Receiver UI**   | `ui/ReceiverView.tsx`              | ⚠️ Placeholder |
| **Cue System** | —                                     | ❌ Missing  |
| **Fixture Model** | —                                   | ❌ Missing  |
| **VFX/Layers** | —                                     | ❌ Missing  |
| **Preset System** | —                                    | ❌ Missing  |

**Bottom line**: We have a working WebSocket backbone and mode switcher. Everything above the wire — UX, cue engine, fixture model, skins — needs to be built.

---

## User Review Required

> [!IMPORTANT]
> **Scope Decision**: The plan below covers **foundational architecture + a fully functional Controller UI + live cueing MVP**. It does NOT yet include native wrappers, timecode sync, or the investor pitch tooling. These are Phase 2+ concerns.

> [!WARNING]
> **Current UI Regression**: The Controller UI has a "Generating..." stuck state. This will be resolved as part of the Controller Dashboard rebuild (Step 3).

---

## Proposed Changes

### 1. Type System & Data Model

#### [MODIFY] [index.ts](file:///Users/mac/Desktop/SCREENSLAVER_V1/src/types/index.ts)

Expand from basic types to the full fixture/cue/preset/layer model defined in the ChatGPT spec:

- `Fixture` (replaces loose `ScreenUnit`): `deviceId`, `friendlyName`, `deviceType`, `capabilities[]`, `state: DeviceState`, `cueStack: Cue[]`, `group: string | null`
- `DeviceState` expanded: add `call.state`, `text.unread`, `alarm.state`, `chroma.mode`, `chroma.color`, `tracking.overlay`, `carrier`, `wifi`, `airplane`, `doNotDisturb`, `brightness`, `skin`
- `Cue`: `id`, `name`, `color`, `targets[]`, `actions: CueAction[]`, `status: 'ready' | 'fired' | 'skipped'`, `mode: 'manual'`
- `Preset`: `id`, `name`, `fixtureStates: Record<deviceId, Partial<DeviceState>>`
- `VFXLayer`: `skinId`, `overrides: Partial<DeviceState>`, `vfx: { chromaMode, chromaColor, trackingOverlay, opacity }`
- `SessionMessage`: `target: 'device' | 'group' | 'all'`, `deviceId?`, `action`, `parameters`, `cueId?`

---

### 2. Core Engine Modules

#### [NEW] [fixtureManager.ts](file:///Users/mac/Desktop/SCREENSLAVER_V1/src/core/fixtureManager.ts)

Zustand store managing all connected devices as "fixtures":
- `addFixture()`, `removeFixture()`, `getFixture()`, `getGroup()`, `updateFixtureState()`
- Groups: `createGroup()`, `addToGroup()`, `removeFromGroup()`
- Device-type filtering: `getByType('phone' | 'tablet' | 'monitor')`

#### [NEW] [cueManager.ts](file:///Users/mac/Desktop/SCREENSLAVER_V1/src/core/cueManager.ts)

Zustand store for cue stack orchestration:
- `addCue()`, `removeCue()`, `fireCue(cueId)`, `skipCue(cueId)`, `resetCue(cueId)`
- `fireGroup(groupName, cueId)`, `fireAll(cueId)`
- `resetAllCues()` — critical for fast resets between takes
- **Rule**: Cues NEVER auto-fire. Always manual `GO` trigger.

#### [NEW] [presetManager.ts](file:///Users/mac/Desktop/SCREENSLAVER_V1/src/core/presetManager.ts)

- `loadPreset(preset)` → sets fixture states WITHOUT firing cues
- `savePreset(name)` → snapshots current fixture states
- `listPresets()`, `deletePreset(id)`

#### [NEW] [layerManager.ts](file:///Users/mac/Desktop/SCREENSLAVER_V1/src/core/layerManager.ts)

Manages the 3-layer system per fixture:
- Skin Layer (visual appearance)
- Override Layer (live parameter changes)
- VFX Layer (chroma, tracking, overlays)
- Layers are independent, combinable, togglable per fixture

#### [MODIFY] [sessionManager.ts](file:///Users/mac/Desktop/SCREENSLAVER_V1/src/core/sessionManager.ts)

- Integrate with `fixtureManager` — devices register as fixtures on join
- Add scene context: `sceneLabel`, `scenePreset`
- Support per-device vs. group vs. global message targeting

#### [MODIFY] [commManager.ts](file:///Users/mac/Desktop/SCREENSLAVER_V1/src/core/commManager.ts)

- Add message routing: per-device / group / all targeting
- Add structured message types matching `SessionMessage` schema
- Add event handlers for: `fire_cue`, `state_update`, `preset_load`, `vfx_toggle`

---

### 3. Controller Dashboard (Complete Rebuild)

#### [MODIFY] [ControllerDashboard.tsx](file:///Users/mac/Desktop/SCREENSLAVER_V1/src/ui/ControllerDashboard.tsx)

Full 4-zone layout inspired by Base44 prototype + ChatGPT wireframes:

**Zone 1 — Top Bar**:
- Session code (monospace, large), scene label
- Group selector dropdown
- Preset loader dropdown
- Global **GO ALL** button (orange accent)

**Zone 2 — Device Tabs + Panel** (left):
- Tabs: `All Devices` | `Phones` | `Tablets` | `Monitors` | `Hero`
- Device cards: name, type icon, battery%, signal, connection status
- Click to select → opens per-device controls in Inspector

**Zone 3 — Cue Stack** (center):
- Per-device or grouped cues, color-coded by status
- Each cue row: name, target device(s), status badge, individual **GO** button
- Large tactile buttons optimized for touch
- Quick Actions: `Incoming Call`, `Text Message`, `Notification`, `Alarm`, `Blackout`

**Zone 4 — Inspector / Preview** (right):
- Selected device detail view
- Live parameter sliders: battery, signal, brightness
- Toggles: Wi-Fi, Airplane, DND, Carrier name
- VFX controls: Chroma mode, tracking overlay, opacity
- Real-time device preview mockup

#### [NEW] [components/](file:///Users/mac/Desktop/SCREENSLAVER_V1/src/ui/components/)

- `DeviceCard.tsx` — fixture status card
- `CueRow.tsx` — single cue in the stack
- `GoButton.tsx` — large orange tactile trigger button
- `StatusBadge.tsx` — Ready/Fired/Skipped indicator
- `ParameterSlider.tsx` — override slider component
- `DeviceTabs.tsx` — tab bar for device type filtering
- `TopBar.tsx` — session info + global controls
- `QuickOverlay.tsx` — toggle overlays (chroma, grid, markers)

---

### 4. Receiver View (Polish)

#### [MODIFY] [ReceiverView.tsx](file:///Users/mac/Desktop/SCREENSLAVER_V1/src/ui/ReceiverView.tsx)

- Full-screen prop display with realistic phone skin
- Status bar rendering from `DeviceState` (time, battery, signal, carrier)
- Respond to incoming cue events: show call screen, text notification, alarm, etc.
- VFX layer support: chroma background, tracking markers overlay
- Crew-only mini status bar (toggle): device name, session code, connection
- Emergency reset gesture (long-press hidden zone)
- Prop-lock mode: prevent accidental navigation

---

### 5. Landing Page / Mode Select

#### [MODIFY] [App.tsx](file:///Users/mac/Desktop/SCREENSLAVER_V1/src/App.tsx)

Redesign setup screen from plain buttons to premium landing page:
- Dark theme with cinematic gradient
- App title + tagline: *"Universal OS for Screens"*
- Two large cards: **Controller** (with dashboard icon) and **Receiver** (with phone icon)
- Quick Tools section: Chroma Screen, Color Chart, Calibration Grid
- Scene label input (optional, for context)

---

### 6. Backend Upgrade

#### [MODIFY] [server.js](file:///Users/mac/Desktop/SCREENSLAVER_V1/backend/server.js)

- Per-device message routing (not just broadcast)
- Group management: `create_group`, `add_to_group` events
- Cue events: `fire_cue`, `skip_cue`, `reset_cues`
- Preset events: `load_preset`, `save_preset`
- VFX events: `toggle_vfx`, `update_vfx`
- Scene context: `set_scene_label`
- State snapshots for reconnection recovery

---

### 7. Design System

#### [MODIFY] [index.css](file:///Users/mac/Desktop/SCREENSLAVER_V1/src/index.css)

Define CSS custom properties for the design system:

```css
--bg-primary: #1a1a1e     /* deep charcoal */
--bg-surface: #252529     /* card/panel background */
--accent-action: #f97316  /* orange — GO/Fire buttons */
--accent-ok: #22c55e      /* green — connected/ready */
--accent-danger: #ef4444  /* red — stop/kill/disconnect */
--accent-warning: #eab308 /* yellow — skipped/pending */
--text-primary: #f5f5f5
--text-muted: #a1a1aa
--font-mono: 'JetBrains Mono', 'SF Mono', monospace
--font-sans: 'Inter', system-ui, sans-serif
```

---

## Verification Plan

### Automated Tests
1. `npm run dev` — verify app loads without errors
2. Start backend: `node backend/server.js` — verify Socket.IO listening
3. Open two browser tabs → create session in one, join in another
4. Fire a cue from Controller → verify Receiver view updates
5. Test cue lifecycle: Ready → Fired → Reset
6. Test device tabs filtering
7. Test preset load → verify states applied without auto-triggering cues

### Manual Verification
- Visual inspection of dark theme, orange accent buttons, layout proportions
- Touch-target sizing on mobile viewport (minimum 44×44px)
- Cue stack responsiveness with 5+ cues
- Device panel with 4+ connected devices
- VFX toggle: chroma background visible on Receiver

---

## Build Order (Dependency-Sorted)

| Step | What | Depends On |
|------|------|------------|
| 1 | Type system expansion (`types/index.ts`) | — |
| 2 | Design system (`index.css`) | — |
| 3 | `fixtureManager.ts` | Types |
| 4 | `cueManager.ts` | Types, fixtureManager |
| 5 | `presetManager.ts` | Types, fixtureManager |
| 6 | `layerManager.ts` | Types |
| 7 | Backend upgrade (`server.js`) | Types |
| 8 | `sessionManager.ts` upgrade | fixtureManager, commManager |
| 9 | UI components (DeviceCard, CueRow, GoButton, etc.) | Design system |
| 10 | Controller Dashboard rebuild | All managers + components |
| 11 | Landing page redesign (`App.tsx`) | Design system |
| 12 | Receiver View polish | layerManager, cueManager |
| 13 | Integration testing | All above |
