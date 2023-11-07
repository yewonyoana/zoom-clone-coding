//환경 구축
// server.js ➡️ Back End에서 구동 됨

import http from "http";
import WebSocket from "ws";
// ⬇️ Express handles http
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
// ⬇️ The file that is public to the user
app.use("/public", express.static(__dirname + "/public"));
// ⬇️ Sender sends a "get request" to the "/" and the "server responds" with a home.pug template (rendering home.pug when user goes to "/(homepage)")
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

// ⬇️  Getting access to server with express app to use WebSocket
const server = http.createServer(app);
// ⬇️ Creating a WebSocket server
// - With "({ server })",  WebSocket server with start with http server to share the same port (3000) (BUT optional)
const wss = new WebSocket.Server({ server });

// ⬇️ Fake database
const sockets = [];

// ⬇️ Helps communicate (send/receive msgs) with Front End in real-time 🟰 Bi-directional connection btw BE and FE
// - Shows in VSC terminal by using "console.log"
// - "socket" represents the browser that connected
wss.on("connection", (socket) => {
	sockets.push(socket);
	socket["nickname"] = "Anon";
	console.log("Connected to Browser ✅");
	// ⬇️ Anonymous function (same as using function)
	socket.on("close", () => console.log("Disconnected from Browser ❌"));
	socket.on("message", (msg) => {
		// console.log(message.toString("utf-8"));
		// ⬇️ "JSON.parse" turns string into JS object
		const message = JSON.parse(msg);
		switch (message.type) {
			case "new_message":
				sockets.forEach((aSocket) =>
					aSocket.send(
						`${socket.nickname}: ${message.payload}`.toString("utf-8")
					)
				);
			case "nickname":
				socket["nickname"] = message.payload;
		}
	});
});

server.listen(3000, handleListen);
