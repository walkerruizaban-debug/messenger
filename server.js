
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

let guestNumber = 0;

io.on("connection", (socket) => {
    guestNumber++;

    const guestName = "Guest " + guestNumber;

    console.log(guestName + " connected");

    socket.on("chat message", (message) => {
        if (typeof message !== "string") {
            return;
        }

        const text = message.trim();

        if (text.length === 0 || text.length > 1000) {
            return;
        }

        io.emit("chat message", {
            id: socket.id,
            name: guestName,
            text: text,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })
        });
    });

    socket.on("disconnect", () => {
        console.log(guestName + " disconnected");
    });
});

const PORT = 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log("--------------------------------");
    console.log("MESSENGER SERVER IS RUNNING!");
    console.log("PC 1: http://localhost:3000");
    console.log("--------------------------------");
});
