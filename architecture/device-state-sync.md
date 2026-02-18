# SOP: Device State Synchronization

## 1. Overview
Ensures that the state of every Receiver device matches the authoritative state defined by the Controller.

## 2. Synchronization Flow
1. **Controller Update**: User changes state (e.g., battery to 80%).
2. **Transport Selection**: System checks `connectionState`.
    - If `CONNECTED_CLOUD`: Emits to Cloud Server.
    - If `CONNECTED_LOCAL`: Emits to Local Server.
3. **Diff Broadcast**: Server relays `STATE_UPDATE` to room.
4. **Receiver Render**: Receiver applies state diff.

## 3. Data Flow
- **Event**: `update_state`
- **Payload**:
```json
{
  "deviceId": "abc123",
  "state": {
    "battery": 80,
    "currentApp": "messages"
  },
  "timestamp": 1234567890
}
```

## 4. Conflict Resolution
- **Timestamp Priority**: If multiple updates occur, the latest timestamp takes precedence.
- **Controller Authority**: Receiver inputs (if any) are always secondary to Controller commands.
