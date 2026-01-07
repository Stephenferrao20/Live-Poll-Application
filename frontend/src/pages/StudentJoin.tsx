import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

export default function StudentJoin() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const handleContinue = () => {
    if (!name.trim() || !socket) {
    console.warn("Socket not ready");
    return;
  }

    // Persist student identity
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("role", "STUDENT");

    socket?.emit("user_join", {
      name,
      role: "STUDENT",
    });

    navigate("/poll/live");

    
  };

  return (
    <div className="page-center">
      <h1 className="title">Let’s Get Started</h1>
      <p>Enter your name to participate in the poll</p>

      <input
        placeholder="Enter your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button className="primary-btn" disabled={!name || !socket } onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}
