import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoleSelect() {
  const [role, setRole] = useState<"STUDENT" | "TEACHER" | null>(null);
  const navigate = useNavigate();

    const handleContinue = () => {
    if (!role) return;

    sessionStorage.setItem("role", role);

    if (role === "STUDENT") navigate("/student/join");
    if (role === "TEACHER") navigate("/teacher/create");
  };

  return (
    <div className="page-center">
      <h1 className="title">Welcome to the Live Polling System</h1>
      <p className="subtitle">
        Please select the role that best describes you
      </p>

      <div className="card-row">
        <div
          className={`role-card ${role === "STUDENT" ? "active" : ""}`}
          onClick={() => setRole("STUDENT")}
        >
          <h3>I’m a Student</h3>
          <p>Participate in live polls and submit answers</p>
        </div>

        <div
          className={`role-card ${role === "TEACHER" ? "active" : ""}`}
          onClick={() => setRole("TEACHER")}
        >
          <h3>I’m a Teacher</h3>
          <p>Create polls and view results in real time</p>
        </div>
      </div>

      <button className="primary-btn" disabled={!role} onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}
