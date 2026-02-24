# SOP: Cue Execution

This document defines the technical standard for triggering, transmitting, and executing cues across the ScreenSlaver multi-device network.

## 1. Data Structure (Cue Definition)

Cues are stored in the `cues` table and shared via `SyncEngine`. 

```typescript
{
  id: string;          // UUID
  name: string;        // Human readable identifier
  type: CueType;       // 'call', 'message', 'alert', 'wallpaper', 'app'
  target: string;      // DeviceID, GroupName, or 'ALL'
  data: any;           // Type-specific payload
  delay: number;       // ms before execution
  duration: number;    // ms total duration (if applicable)
  order: number;       // Position in cue stack
  color: string;       // UI theme color
  fired: boolean;      // Execution state
}
```

## 2. Trigger Flow

1. **Controller**: User clicks "Fire" on a specific cue.
2. **Synchronizer**: `SyncEngine` sets `fired: true` and updates `data` if dynamic (e.g. current timestamp).
3. **Database**: Row is updated in Supabase.
4. **Realtime Channel**: Supabase broadcasts the `UPDATE` payload to all subscribers.
5. **Receiver**: Receivers filtering for their DeviceID or Group receive the payload.

## 3. High-Priority vs. Standard Cues

| Level | Mechanism | Usage |
|---|---|---|
| **Standard** | Postgres Change | Non-critical state changes (Wallpaper, Battery) |
| **High-Priority** | Realtime Broadcast | Actor-facing triggers (Inbound Call, Alarms) |

> [!IMPORTANT]
> To achieve <100ms latency, high-priority cues should bypass the database and use **Supabase Broadcast Channels** directly, while simultaneously updating the DB for persistence.

## 4. Execution Constraints

- **Actor Safety**: When a cue is executing, the Receiver UI must lock out user input except for cue-specific interactions (e.g. "Answer Call").
- **Persistence**: If a device joins a session late, it should scan the `cues` table for the "Currently Active" cue to match the state of the room.
