# Base44 Prototype — Complete Feature Extraction

> Cross-referenced analysis of the 25:14 video transcript with 115+ screenshots.
> Every feature, design preference, and UX decision extracted for ScreenSlaver implementation.

---

## 1. Branding & Design Language

### Color Palette
| Element | User Preference | Evidence |
|---------|----------------|----------|
| **Primary Accent** | Base44 orange — *"one of my favorite colors"* | [0:56–1:02] |
| **Background** | Obsidian / Charcoal — *"I like this charcoal colors"* | [4:58], [16:04] |
| **Text** | White and gray lettering — *"keep the lettering white and gray"* | [16:11] |
| **Button Glow** | Orange instead of white — *"this glow around the button… could be this Base44 orange"* | [5:05] |
| **Overall** | *"Hints of orange around the layout"* — NOT full orange, just accents | [16:04–16:19] |
| **Tone** | *"A bit monochrome… hints of orange would go really well with Obsidian and Charcoal"* | [15:57–16:04] |

> [!IMPORTANT]
> The user explicitly wants **subtle orange accents** against a dark Obsidian/Charcoal palette. Not a full orange theme. White/gray text. Orange is reserved for interactive elements, glows, and emphasis.

### Logo & Naming
- Name changed from **PropMaster → ScreenSlaver**, logo kept
- [0:45–0:56]: *"The logo at the time it was called PropMaster… we have now changed it to ScreenSlaver while keeping the logo"*

![Home screen with PropMaster branding and orange tile accents](base44_video_120s_1771387478151.png)

---

## 2. Home Screen / Landing Page

### Layout (Confirmed at [1:17–1:51])
Three main tiles + assistant widget:

| Tile | Icon | Description (from UI) |
|------|------|-----------------------|
| **Controller** | `⊞` sliders icon | *"Manage all devices on set. Create presets, trigger cues, and orchestrate multi-device scenes."* |
| **Receiver** | `☐` phone icon | *"Turn this device into a prop. Full-screen display mode, locked controls, VFX-ready overlays."* |
| **Quick Tools** | `⊕` tools icon | *"Chroma screens, color charts, calibration grids & custom images — no session needed"* |

### Key Design Decisions
- **Animation on load**: *"It has this layout, a bit of animation"* [1:24]
- **Button hover**: *"Once we are queuing between buttons has this [animation]"* [1:32]
- **Assistant widget**: 5 rotating text boxes — *"makes it look a bit upgraded"* [1:40]. User later calls it *"our own version of Clippy"* [25:01]. Could become interactive chatbot [24:54].
- **Quick Tools on home**: User *"really liked how it integrated quick tools here"* [1:51] — must stay accessible from home for guerrilla crews

### Landing Page Bug 🐛
- [24:33–24:51]: *"A lot of the times when I'm watching the app, it's landing us here"* (Controller page) *"and I want this to land here"* (Home page)
- The `/Controller` route was incorrectly set as the default landing, skipping the home screen

![Wrong landing — Controller page loads instead of Home](base44_vid_1470s_1771388973793.png)

### Loading Screen
- [24:41–24:47]: *"The loading screens should be something like just the logo or something or this part in black, and then it comes to this [home screen]"*

---

## 3. Quick Tools (Standalone — No Session Required)

User describes these at [1:56–3:50]. Designed for guerrilla productions where actors = directors.

### Available Tools

| Tool | Details | Timestamp |
|------|---------|-----------|
| **Green Screen** | Chroma green fullscreen | [2:23] |
| **Blue Screen** | Chroma blue fullscreen | [2:23] |
| **18% Gray** | Industry standard mid-gray | [2:23–2:33] |
| **50% Gray** | Half-brightness gray | [2:23–2:33] |
| **Through Black** | Pure black reference | [2:33] |
| **Through White** | Pure white reference | [2:33] |
| **Tracking Markers** | Dots/grid overlays, toggleable ON/OFF *"with or without tracking markers"* | [2:33] |
| **Fullscreen Mode** | *"Enabling full screen"* on any formatted screen | [2:42] |
| **Color Calibration Chart** | Post-production reference — *"one of the standards"*. Wants **multiple chart types** depending on post-production software | [3:08–3:20] |
| **Calibration Grid** | Screen grid overlay | [3:25–3:33] |
| **Custom Image Upload** | *"Upload just an image or whatever. If you just want to use the screen as that."* | [3:41–3:50] |

![Quick Tools — Chroma options](base44_video_150s_1771387966565.png)

### Triple-Tap Screen Lock (NEW FEATURE)
- [2:51–3:02]: *"I would also like for us to have the option of tapping three times the screen to like fully lock it so that no accidental touches can happen"*
- Applies to both Quick Tools AND Receiver mode
- Prevents accidental touch interference during filming

> [!TIP]
> This triple-tap lock is mentioned for Quick Tools AND later for Receiver mode [10:02]. It should be a **universal feature** available on any fullscreen display.

---

## 4. Controller Dashboard

### Session Creation Flow ([5:33–6:42])
1. Set device name (auto-detect or manual): *"It should be able to identify the actual device"* → e.g., "SAM's Phone"
2. Set scene description: *"Scene 1 Ext. Night - School Bleachers"*
3. Create new session → generates **6-character alphanumeric session code** (e.g., `29W95N`)
4. QR code for joining: *"People on set can just scan the code and join the session"* [6:56]

![Controller Dashboard with session code 29W95N](base44_video_396s_1771388327928.png)

### Dashboard Layout (4-Zone)

```
┌─────────────────────────────────────────┬──────────────────┐
│  HEADER: Logo | Session Code | QR |     │                  │
│  Scene Label | Device Count | Reset/Gear│                  │
├─────────────────────────────────────────┤   CUE STACK      │
│  TOOLBAR: Select Preset | Search |      │   + Add Cue      │
│           Add Device                    │   [cue list]      │
├─────────────────────────────────────────┤   [GO button]     │
│  TABS: All | Phones | Tablets |         │                  │
│        Monitors | Hero | Favorites      │                  │
├─────────────────────────────────────────┤                  │
│  DEVICE CARDS:                          │                  │
│  ┌──────────────────────┐               │                  │
│  │ SAM's Phone    ★ ⋮  │               │                  │
│  │ phone · No Group     │               │                  │
│  │ 🔋100% 📶4/4 📡     │               │                  │
│  │ [▷ Fire Next Cue]    │               │                  │
│  └──────────────────────┘               │                  │
└─────────────────────────────────────────┴──────────────────┘
```

### Device Cards — Details ([7:04–9:15])

Each device card shows:
- **Name** (e.g., SAM's Phone)
- **Type** (phone/tablet/monitor)
- **Group** assignment (or "No Group")
- **Battery** level with icon (e.g., 100%)
- **Signal** bars (e.g., 4/4)
- **Wi-Fi** indicator
- **Favorite** star toggle
- **More menu** (⋮) with: Lock characters, Edit device, etc.
- **"Fire Next Cue"** button per device

### Edit Device — The Core Control Panel ([7:54–9:15])

> [!IMPORTANT]
> This is where the "magic" happens. The user envisions Edit Device as the place where you **control the narrative** of what appears on a receiver's screen.

**Must-have controls:**
- Battery level slider — *"edit device should actually let me change all this information, the battery level, with sliders"* [7:54]
- Signal strength slider — *"suddenly slides a toggle and makes it… losing reception"* [8:25–8:40]
- Wi-Fi toggle
- Images / wallpapers
- Text content
- Keyboard layout, colors, main theme, UI [19:36–19:41]

**Example scenario from user** [8:02–9:02]:
> *"On the story, the actor's pretending to suddenly lose reception, and we can actually make it so that this here does the live animation of losing reception, or Wi-Fi or battery… a lot of times what happens with our phones is a narrative beat."*

### Quick Tools in Controller ([19:11–20:07])
- Quick Tools should be accessible **within** the Edit Device section
- *"This edit device part is what should actually open this visual preview and represent the changes that we are doing"* [19:41–19:51]
- A version of Quick Tools could be in each device's bubble layout

### Device Card Layout Preferences
- [7:12–7:33]: User doesn't like the visual preview interfering with the cue stack: *"It maybe should be something that is accessed here… but it shouldn't interfere with my cue stack"*
- Prefers **bubble layout** for devices [7:33]
- Device filter tabs: All Devices | Phones | Tablets | Monitors | Hero ⭐ | Favorites ⭐

### Screen Lock for Receiver (from Controller) ([9:49–10:09])
- *"Once the actor's actually touching the screen, but if we don't want it to move or exit this display, we should be able to have a control here to make the screen locked"*
- Controller should have a toggle to **lock the receiver screen** so the physical phone acts as a display only

![Controller dashboard with device card expanded](base44_video_480s_v2_1771388410154.png)

---

## 5. Cue System

### Add Cue Modal ([10:17–11:49])

**Fields:**
| Field | Description |
|-------|-------------|
| **Cue Name** | Free text (e.g., "SOS Sam's Mum") |
| **Cue Type** | 8 types in a 4×2 grid with icons |
| **Target** | Device or Group toggle |
| **Contact Name** | For call/text types (e.g., "Mom") |
| **Phone Number** | Formatted number (e.g., "+1 555 34...") |

**8 Cue Types** (confirmed visually at 760s):

| Type | Icon | Description |
|------|------|-------------|
| Incoming | 📞↙ | Incoming call simulation |
| Outgoing | 📞↗ | Outgoing call simulation |
| Text | 💬 | Text message notification |
| Notification | 🔔 | Generic notification |
| Alarm | ⏰ | Alarm/timer trigger |
| Home | 🏠 | Switch to home screen |
| Lock | 🔒 | Switch to lock screen |
| Idle | 🔓 | Idle/sleep state |

![Add New Cue modal showing all 8 cue types and Group targeting](base44_vid_760s_1771388916096.png)

### Cue Stack Behavior ([11:57–15:50])

- Cues listed in order in the right panel
- Each cue has a **play button** to fire individually
- **"GO" button** at bottom of stack to fire next cue in sequence
- Cue **reordering** via drag: *"Be able to click on this thing and reorganize the queue order"* [15:11–15:21]
- **Fire whole stack** with timers: *"Fire the whole stack with proper timers and stuff, and affecting different devices"* [15:21–15:29]
- **Automatic mode**: *"Once the acting is locked in… it would be very cool to just fully trigger the stack on automatic"* [15:29–15:43]

### Cue Stack Position — User Critique ([11:57–12:13])
- *"The queue stack before used to be here, and it would be collapsible"* — prefers it on the right side, collapsible
- Wants a hybrid of device view + cue view

### DJ Groove Box View (MAJOR FEATURE REQUEST) ([13:38–14:07])
> [!IMPORTANT]
> *"It would be cool if we had an option to have a second view mode of the whole dashboard, that instead of a collection of devices here, we can just have the stacks, like a DJ groove box or music — like DJs have — of different hot cues lined up as a grid, and that we can just play around with them."*

This is a **grid-based cue launcher** — think Ableton Push / Novation Launchpad:
- Grid of cue buttons
- Color-coded by type
- Fire any cue instantly with a tap
- Becomes the *"main view"* once everything is set up

### Cue Preview ([12:57–13:13])
- *"The other cool thing is that we can see, kind of, more or less, what these cues would do here on the screen"* — a small preview showing what the receiver would display

---

## 6. Session Management

### Save & Resume Sessions ([16:25–18:40])
- **Exit session** should prompt to save: *"We should be able to save sessions so that we don't completely screw our work"* [16:32–16:40]
- **Resume sessions**: *"Come back to the session two weeks from now once we reshoot"* [18:32–18:40]
- Use case: Scene postponed → save → reshoot later → load exact same session state

### Settings & Reset ([9:31–9:49])
- Reset All: *"Not physically resetting anything, just popping up the notification saying it's doing it but it's not"* — **broken in Base44**
- Settings gear icon should contain actual settings
- Exit/Leave session button

---

## 7. Presets & Monetization

### Visual Presets ([16:47–17:03])
- Phone presets: *"Android skin, generic"*
- Different visual layouts for phones, tablets, monitors, TVs
- Saveable and reusable across sessions

### Monetization Ideas ([17:10–17:56])
- **Freemium model**: *"You can have everything customizable, but people need to pay for a service"*
- **Save presets paywall**: *"You will need to pay to save more than one preset"*
- **Premium cue packs**: *"Add cooler cues and automations and rigging"* — common situation templates
- *"For later. It doesn't really have to do with the interfaces."* [17:50–17:56]

### Base44 Code Entities (from code view at 1300s)

The Base44 prototype's data model includes 4 entities:
- `Cue`
- `Device`
- `Preset` (with `device_states[]` and `cue_stack[]`)
- `Session`

![Base44 code view — Preset entity schema](base44_vid_1300s_1771388972403.png)

---

## 8. Receiver Mode

### Join Flow ([18:41–19:05])

![Receiver Mode join screen](base44_vid_1128s_1771388954087.png)

**Fields:**
| Field | Placeholder | Description |
|-------|-------------|-------------|
| **Device Name** | *"e.g., Hero Phone A"* | How it appears on Controller |
| **Device Type** | Phone (dropdown) | Phone / Tablet / Monitor / etc. |
| **Session Code** | `XXXXXX` | 6-character code from Controller |

Then: **"Join Session"** button → device becomes controlled by the Controller dashboard.

### Receiver Behavior
- [19:05]: *"If it's a phone, it will just become what we want from the controller dashboard"*
- Shows simulated lock screen, receives cues, displays what Controller dictates
- Needs **screen lock** (triple-tap or from Controller) to prevent accidental touches

---

## 9. Dashboard Modes / Secondary Views

### User's Vision ([20:07–20:38])
*"Let's make also a version of dashboard or like secondary view. This is Device Management and then we see Queue or Show Management or Queue Orchestration mode."*

**Proposed tabs at the top:**
| Tab | Purpose |
|-----|---------|
| **Device Management** | Current main view — device cards, categories, edit device |
| **Cue Orchestration** | The DJ groove box grid view — fire cues from a grid |
| **Show Management** | Overview of full show flow? (implied but not detailed) |

*"Different types of modes that we could switch from like tabs here that we can switch on"* [20:29]

---

## 10. Known Bugs & Broken Features in Base44

| Bug | Timestamp | User Quote |
|-----|-----------|------------|
| Quick Tools return button broken | [3:57–4:19] | *"This return button is not really working… it's not letting me go back to home"* |
| Controller landing page override | [4:26–4:51] | *"The controller is the landing page. There's no way to select receiver mode"* |
| Search devices not working | [9:24–9:31] | *"Search devices, add devices part is not really working really well"* |
| Reset All not functional | [9:31–9:38] | *"It's just popping up the notification saying it's doing it but it's not"* |
| Edit device not fully working | [9:09–9:15] | *"That part is not really working"* |
| Cue firing not functional | [12:57–13:13] | *"Functionally, it's not working"* |
| Can't add second device | [14:33–14:52] | *"It's not even letting me add another device"* (expected — only one receiver connected) |

### User's Overall Assessment ([20:43–21:31])
> *"This Base44 version is not really letting me do much on the functional side, but I think I was able to create a layout that I really like."*
> *"It's pretty, but it's not really working."*
> *"Don't take this code as gospel."*

---

## 11. User's Hierarchy of What Matters

Ranked by emphasis and repetition in the transcript:

1. **Narrative-driven device control** — Battery, signal, Wi-Fi as storytelling tools
2. **Cue system that actually fires** — Sequenced, timed, automatic
3. **DJ groove box view** — Grid-based cue launcher as a secondary dashboard
4. **Orange accent design** — Obsidian/charcoal base with Base44 orange highlights
5. **Quick Tools accessible from home** — No session needed, guerrilla-friendly
6. **Triple-tap screen lock** — Universal across Quick Tools and Receiver
7. **Session save & resume** — Critical for real productions across shooting days
8. **Edit Device as the control hub** — Visual preview + sliders for every parameter
9. **Correct landing page** — Home first, then choose mode
10. **Preset system** — Save device looks + cue stacks for reuse

---

## 12. Screenshot Reference Index

### Early Video (0:00–2:00) — Setup & Home Screen
| Time | File | Content |
|------|------|---------|
| 0:00 | [00s](base44_video_00s_1771386773205.png) | VS Code / initial setup |
| 1:12 | [72s](base44_video_72s_1771387371577.png) | Base44 editor — edited components list |
| 2:00 | [120s](base44_video_120s_1771387478151.png) | **Home screen** — Controller / Receiver / Quick Tools |

### Quick Tools (2:00–4:00)
| Time | File | Content |
|------|------|---------|
| 2:30 | [150s](base44_video_150s_1771387966565.png) | **Quick Tools** — Chroma, Charts & Calibration |
| 3:06 | [186s](base44_video_186s_1771388062742.png) | Color calibration chart |
| 3:24 | [204s](base44_video_204s_1771388066850.png) | Calibration grid |

### Controller Dashboard (5:00–10:00)
| Time | File | Content |
|------|------|---------|
| 5:00 | [300s](base44_video_300s_1771388174800.png) | **Home screen** with assistant + chat sidebar |
| 6:36 | [396s](base44_video_396s_1771388327928.png) | **Full Controller Dashboard** — session code, device card, cue stack |
| 8:00 | [480s](base44_video_480s_v2_1771388410154.png) | **Device card** expanded with favorite star |
| 8:30 | [510s](base44_vid_510s_1771388731811.png) | Controller with device management |
| 9:00 | [540s](base44_vid_540s_1771388752974.png) | Device card interactions |

### Cue System (10:00–15:00)
| Time | File | Content |
|------|------|---------|
| 12:40 | [760s](base44_vid_760s_1771388916096.png) | **Add New Cue modal** — all 8 cue types visible |
| 13:10 | [790s](base44_vid_790s_1771388922876.png) | Device + phone preview with cue stack |
| 13:50 | [830s](base44_vid_830s_1771388930724.png) | Dashboard with preset dropdown |

### Dashboard & Settings (16:00–20:00)
| Time | File | Content |
|------|------|---------|
| 16:00 | [960s](base44_vid_960s_1771388939491.png) | Dashboard overview |
| 16:25 | [985s](base44_vid_985s_1771388950160.png) | Settings / reset flow |
| 16:50 | [1010s](base44_vid_1010s_1771388951426.png) | **Preset creation** — Select Preset menu open |
| 17:30 | [1050s](base44_vid_1050s_1771388952859.png) | Empty cue stack |

### Receiver & Code View (18:00–25:00)
| Time | File | Content |
|------|------|---------|
| 18:48 | [1128s](base44_vid_1128s_1771388954087.png) | **Receiver Mode** — join form |
| 19:40 | [1180s](base44_vid_1180s_1771388969748.png) | New device joined in session |
| 20:20 | [1220s](base44_vid_1220s_1771388971095.png) | Dashboard with device tabs |
| 21:40 | [1300s](base44_vid_1300s_1771388972403.png) | **Base44 Code View** — Preset entity schema |
| 24:30 | [1470s](base44_vid_1470s_1771388973793.png) | **Bug**: Wrong landing page (`/Controller`) |
| 24:50 | [1490s](base44_vid_1490s_1771388974945.png) | Correct home page |
