import { io } from "socket.io-client";

const socket = io("https://whiteboarddeployed.onrender.com", {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Connected to WebSocket:", socket.id);
});

export default socket; // ⭐ THIS LINE WAS MISSING
