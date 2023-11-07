// app.js ➡️ Front End에서 구동 됨

const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
// ⬇️ Can send/receive msgs to Back End 🟰 Bi-directional connection btw FE and BE
// - "socket" represents a connection to the web server (vs. "socket" in server.js)
// - To have access to homepage on phone, using "window.location.host" instead of "localhost:3000"
const socket = new WebSocket(`ws://${window.location.host}`);

// ⬇️ Must not send JS object to BE as the server might not be JS server (Java, Go, etc.)
// - Hence string is sent
function makeMessage(type, payload) {
	const msg = { type, payload };
	// ⬇️ "JSON.stringify" takes JS object and turns it into a string
	return JSON.stringify(msg);
}

// ⬇️ Shows in console.log in browser inspection
socket.addEventListener("open", () => {
	console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
	// ⬇️ For the message to show up on the screen
	const li = document.createElement("li");
	li.innerText = message.data;
	messageList.append(li);
});

socket.addEventListener("close", () => {
	console.log("Disconnected from Server ❌");
});

// ⬇️ Sending msg to chatroom
function handleSubmit(event) {
	event.preventDefault();
	const input = messageForm.querySelector("input");
	socket.send(makeMessage("new_message", input.value));
	input.value = "";
}

// ⬇️ Changing nickname
function handleNickSubmit(event) {
	event.preventDefault();
	const input = nickForm.querySelector("input");
	socket.send(makeMessage("nickname", input.value));
	input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
