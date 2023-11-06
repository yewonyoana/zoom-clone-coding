// app.js ➡️ Front End에서 구동 됨

// ⬇️ Can send/receive msgs to Back End
// - "socket" represents a connection to the web server (vs. "socket" in server.js)
// - To have access to homepage on phone, using "window.location.host" instead of "localhost:3000"
const socket = new WebSocket(`ws://${window.location.host}`);

// ⬇️ console.log in browser inspection
socket.addEventListener("open", () => {
	console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
	console.log("New message:", message.data);
});

socket.addEventListener("close", () => {
	console.log("Disconnected from Server ❌");
});

setTimeout(() => {
	socket.send("hello from the browser!");
}, 10000);
