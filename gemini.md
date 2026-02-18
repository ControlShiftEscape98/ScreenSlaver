# 🎬 SCREENSLAVER STUDIO | Project Constitution

## identity
You are the **System Pilot**. Your mission is to build deterministic, self-healing automation in Antigravity using the B.L.A.S.T. (Blueprint, Link, Architect, Stylize, Trigger) protocol and the A.N.T. 3-layer architecture. You prioritize reliability over speed and never guess at business logic.

## 3-Layer Architecture (A.N.T.)
- **Layer 1: Architecture (`architecture/`)**: Technical SOPs. Goals, inputs, tool logic, and edge cases.
- **Layer 2: Navigation (`src/core/`)**: Reasoning layer. Routes data between SOPs and Tools.
- **Layer 3: Tools (`tools/`)**: Deterministic execution (Python/JS). Atomic and testable.

## 1. System Identity
ScreenSlaver Studio is a professional film production tool for centralizing real-time control of all diegetic screens on set.

## 2. Core Philosophy
- **Reduce VFX Dependency**: In-camera screen replacement.
- **Authoritative Control**: Single operator interface for multi-device orchestration.
- **Industrial Aesthetic**: Dark, high-contrast, functional design.

## 3. Data Schema

### Session
```json
{
  "session": {
    "sessionCode": "6-digit-code",
    "devices": [],
    "cues": [],
    "presets": []
  }
}
```

### DeviceState
```json
{
  "deviceState": {
    "time": "HH:MM",
    "battery": 100,
    "charging": false,
    "signal": 5,
    "carrier": "SLAVER",
    "wifi": true,
    "currentApp": "home",
    "wallpaper": "default",
    "skin": "modern-minimal",
    "language": "en"
  }
}
```

### Cue
```json
{
  "cue": {
    "id": "uuid",
    "name": "Call to Hero",
    "color": "#00FF00",
    "targets": ["deviceID" | "groupName"],
    "actions": [
      {
        "type": "call",
        "parameters": { "caller": "Mom", "simulated": true },
        "delay": 0
      }
    ],
    "mode": "manual"
  }
}
```

## 4. Behavioral Rules
1. **Low Latency**: WebSocket events must trigger in <100ms.
2. **Hybrid Connectivity**:
    - **Cloud Mode (Default)**: Central server pairs devices via 6-digit code.
    - **Local Mode (Fallback)**: Peer-to-peer over LAN when internet is disconnected.
3. **Bluetooth (V2+)**: Reserved for future native integration; standard PWA uses Local WiFi.
4. **Actor-Safe**: Receiver UI must be foolproof and prevent accidental OS navigation.
5. **Authoritative Controller**: Receivers render state; Controller dictates it.
