import { Server } from "socket.io";
import http from "http";
import express from "express";
// import Redis from 'ioredis'

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST"],
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

/**
const pub = new Redis({
	host : "redis-3vrjwj4322-ninwngis4-33jjinook.a.aivencloud.com",
	port : "23434",
	username : "default",
	password : "JVJdwi93rfw_239302rt2qinfWD",
}) 

const sub = new Redis({
	host : "",
	port : "23434",
	username : "default",
	password : "JVJdwi93rfw_239302rt2qinfWD",
}) 



 */



io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId != "undefined") userSocketMap[userId] = socket.id;

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, io, server };
