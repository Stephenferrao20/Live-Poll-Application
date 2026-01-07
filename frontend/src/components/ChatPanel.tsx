import { useContext, useEffect, useState, useRef } from "react";
import { SocketContext } from "../context/SocketContext";

interface Message {
  _id: string;
  name: string;
  role: string;
  message: string;
}

export default function ChatPanel() {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current user's name from sessionStorage
  const currentUserName = sessionStorage.getItem("name") || "Teacher";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("chat:history");

    socket.on("chat:history", setMessages);
    socket.on("chat:new", (msg) =>
      setMessages((prev) => [...prev, msg])
    );

    return () => {
      socket.off("chat:history");
      socket.off("chat:new");
    };
  }, [socket]);

  const send = () => {
    if (!text.trim()) return;
    socket?.emit("chat:send", { message: text });
    setText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const getMessageClasses = (msg: Message) => {
    const isOwn = msg.name === currentUserName;
    const isTeacher = msg.role === "TEACHER";
    
    let classes = "chat-msg-wrapper";
    if (isOwn) classes += " own";
    if (isTeacher) classes += " teacher";
    
    return classes;
  };

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#9ca3af", padding: "20px", fontSize: "13px" }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div key={m._id} className={getMessageClasses(m)}>
                <div className="chat-msg">
                  <div className="chat-msg-header">
                    <strong>{m.name}</strong>
                    {m.role === "TEACHER" && <span className="teacher-badge">Teacher</span>}
                  </div>
                  <span className="chat-msg-text">{m.message}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
