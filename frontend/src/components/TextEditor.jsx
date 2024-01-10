import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "../index.css";
import { io } from "socket.io-client";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const TextEditor = () => {
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const { id: documentId } = useParams();

  //creating a socket connection
  useEffect(() => {
    const s = io(import.meta.env.VITE_WS_SERVER_URL);

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  //loading the document from the server
  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.on("load-document", (document) => {
        quill.setContents(document);
        quill.enable();
    });

    socket.emit("get-document", documentId);

  }, [socket, quill, documentId]);

  //saving the document to the server
  useEffect(() => {
	if (socket == null || quill == null) return;

	const interval = setInterval(() => {
	  socket.emit("save-document", quill.getContents());
	}, 2000);

	return () => {
	  clearInterval(interval);
	};
  }, [socket, quill]);

  //initializing the quill editor
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });

    q.disable();
    setQuill(q);
  }, []);

  //sending the changes to the server
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  //receiving the changes from the server
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  return <div className="container" ref={wrapperRef}></div>;
};

export default TextEditor;
