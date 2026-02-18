# SOP: Session Management

## 1. Overview
The Session Manager handles device pairing via a **Hybrid Connectivity** model. It prioritizes a seamless Cloud Relay (Kahoot-style) but seamlessly falls back to a Direct Local WiFi connection if the internet is unavailable.

## 2. Hybrid Modes
### Mode A: Cloud Relay (Default)
- **Role**: Centralized signaling server on the internet.
- **Discovery**: 6-digit alphanumeric code (e.g., `ABC123`).
- **Data Flow**: Controller -> Cloud -> Receiver.
- **Pros**: Easy pairing, works across different subnets (if needed).

### Mode B: Local Direct (Fallback)
- **Role**: Controller acts as the WebSocket server.
- **Discovery**: QR Code scanning (contains `http://<local-ip>:3001`) or manual IP entry.
- **Data Flow**: Controller <-> Receiver (Direct LAN).
- **Pros**: Zero latency, works without internet, absolute privacy.


## 2. Session Lifecycle
1. **Initiation**: Controller requests a new session.
2. **Code Generation**: A 6-digit alphanumeric code is generated (e.g., `ABC123`).
3. **Registration**: Receivers join the session by providing the `sessionCode` and a `deviceName`.
4. **Active State**: Devices heartbeats ensure they are online.
5. **Termination**: Controller ends the session; all Receivers are disconnected.

## 4. Implementation Details
- **Protocol**: Socket.io (Client supports both Cloud URL and Local IP).
- **connectionState**: `DISCONNECTED` | `CONNECTING` | `CONNECTED_CLOUD` | `CONNECTED_LOCAL` | `OFFLINE`.
- **Latency Target**: <100ms (Cloud), <10ms (Local).

## 4. Error Handling
- **Conflict**: If a device joins with an existing ID, the previous connection is superseded (Auto-Reconnect).
- **Network Drop**: Devices should attempt reconnection for 30s before flagging as "Offline".
