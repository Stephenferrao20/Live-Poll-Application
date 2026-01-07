import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import ChatPanel from "./ChatPanel";
import ParticipantsPanel from "./ParticipantPanel";
import type { Socket } from "socket.io-client";

interface User {
  socketId: string;
  name: string;
  role: "TEACHER" | "STUDENT";
}

export default function ChatWidget() {
  const socket = useContext(SocketContext) as Socket | null;
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"CHAT" | "PARTICIPANTS">("CHAT");
  const [participants, setParticipants] = useState<User[]>([]);

  // Manage participants list in parent component so it persists across tab switches
  useEffect(() => {
    if (!socket) return;

    const handleParticipantsUpdate = (users: User[]) => {
      setParticipants(users);
    };

    socket.on("participants:update", handleParticipantsUpdate);

    return () => {
      socket.off("participants:update", handleParticipantsUpdate);
    };
  }, [socket]);

  return (
    <>
      <button
        className="chat-fab"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

      {open && (
        <div className="chat-widget">
          <div className="chat-tabs">
            <button
              className={tab === "CHAT" ? "active" : ""}
              onClick={() => setTab("CHAT")}
            >
              Chat
            </button>
            <button
              className={tab === "PARTICIPANTS" ? "active" : ""}
              onClick={() => setTab("PARTICIPANTS")}
            >
              Participants
            </button>
          </div>

          {tab === "CHAT" ? (
            <ChatPanel />
          ) : (
            <ParticipantsPanel participants={participants} />
          )}
        </div>
      )}
    </>
  );
}
