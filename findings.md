## Discovery Answers
1. **North Star**: Real-time, multi-device screen control for film sets with zero post-production screen replacement.
2. **Integrations**: **Hybrid Connectivity**. Central Web Server for code-based pairing (Kahoot-style) + Local WiFi/LAN fallback for zero-internet environments.
3. **Source of Truth**: Controller device is authoritative.
4. **Delivery Payload**: Live visual output on Receiver devices.
5. **Behavioral Rules**: Industrial tone, fast response, actor-safe. Hybrid mode must prioritize reliability over cloud dependency.

## Research Findings
### 1. Hybrid Connectivity Model
- **Cloud Mode**: Central relay server (Socket.io) generates 6-digit codes. Easiest setup for standard sets.
- **Local Mode**: Controller hosts local WebSocket server. Receivers connect via Local IP or QR code (fallback for no internet).
- **Bluetooth**: Web Bluetooth API is highly restricted (requires user gesture, unstable on iOS). **Recommendation**: Keep as V2 Research; prioritize WiFi/LAN for V1.
- **Optimizations**: Force `websocket` transport, reduce `pingInterval` (10s) and `pingTimeout` (5s).
- **Network**: Dedicated 5GHz LAN recommended to avoid 2.4GHz interference on set.
- **Overhead**: WebSockets cut ~40-60ms vs polling.

### 2. PWA Fullscreen (iOS/Android)
- **iOS**: Regression in iOS 17.4+; persistent status bar is common. Use `apple-mobile-web-app-capable` but expect limitations.
- **Android**: `display: fullscreen` in manifest works well. Use `start_url` parameters for explicit launch.

### 3. Simulated Typing
- **Method**: React `useState` + `useEffect` with Tailwind `animate-pulse` or custom keyframes for cursor. No heavy libraries needed for V1.
