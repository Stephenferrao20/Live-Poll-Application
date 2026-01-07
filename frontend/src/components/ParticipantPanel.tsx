import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

interface User {
  socketId: string;
  name: string;
  role: "TEACHER" | "STUDENT";
}

interface ParticipantsPanelProps {
  participants: User[];
}

export default function ParticipantsPanel({ participants }: ParticipantsPanelProps) {
  const socket = useContext(SocketContext);
  const role = sessionStorage.getItem("role");

  return (
    <div className="participants-panel">
      {participants.length === 0 ? (
        <div style={{ textAlign: "center", color: "#9ca3af", padding: "20px", fontSize: "13px" }}>
          No participants yet
        </div>
      ) : (
        participants.map((u) => (
          <div key={u.socketId} className="row space-between">
            <span>{u.name}</span>
            {role === "TEACHER" && u.role === "STUDENT" && (
              <button
                className="link-btn"
                onClick={() =>
                  socket?.emit("kick_user", u.socketId)
                }
              >
                Kick
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
