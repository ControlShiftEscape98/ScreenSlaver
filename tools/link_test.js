import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:3001";
const socket = io(SERVER_URL, {
    transports: ["websocket"],
    reconnection: false
});

console.log(`Attempting connection to ${SERVER_URL}...`);

const start = Date.now();

socket.on("connect", () => {
    const latency = Date.now() - start;
    console.log(`✅ Connected in ${latency}ms`);
    console.log(`Socket ID: ${socket.id}`);

    // Test Session Creation
    console.log("Requesting session creation...");
    socket.emit("create_session");
});

socket.on("session_created", (code) => {
    console.log(`✅ Session Created: ${code}`);
    console.log("Link verification SUCCESSFUL.");
    socket.disconnect();
    process.exit(0);
});

socket.on("connect_error", (err) => {
    console.error(`❌ Connection Error: ${err.message}`);
    process.exit(1);
});

// Timeout
setTimeout(() => {
    console.error("❌ Timeout: No connection established within 5s");
    socket.disconnect();
    process.exit(1);
}, 5000);
