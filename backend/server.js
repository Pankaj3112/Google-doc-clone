require("dotenv").config();
const { Document } = require("./db");
const socketIo = require("socket.io");
const express = require("express");

const app = express();
const server = require("http").Server(app); // Use http instead of https

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  //   console.log("New user connected - ", socket.id);

  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);

    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
      console.log(delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findOneAndUpdate({ _id: documentId }, { data });
    });
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: "" });
}

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
