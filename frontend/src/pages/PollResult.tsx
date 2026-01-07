import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import Loader from "../components/Loader";
import type { Socket } from "socket.io-client";

interface Option {
  optionId: string;
  text: string;
  votes: number;
  isCorrect?: boolean;
}

interface Poll {
  _id: string;
  question: string;
  options: Option[];
  status: "ACTIVE" | "ENDED";
}
export default function PollResults() {
  const navigate = useNavigate();
  const socket = useContext(SocketContext) as Socket | null;
  const [poll, setPoll] = useState<Poll | null>(null);

  const role = sessionStorage.getItem("role");

  useEffect(() => {
    if (!socket) return;

    socket.emit("get_active_poll");

    socket.on("poll_state", ({ poll }) => {
      setPoll(poll);
    });

    socket.on("poll_update", (updatedPoll) => {
      setPoll(updatedPoll);
    });

    socket.on("poll_started", ({ poll }) => {
      setPoll(poll);
    });

    socket.on("poll_ended", (endedPoll) => {
      setPoll(endedPoll);
    });

    return () => {
      socket.off("poll_state");
      socket.off("poll_update");
      socket.off("poll_started");
      socket.off("poll_ended");
    };
  }, [socket]);

  if (!poll) {
    return <Loader text="Waiting for poll results..." />;
  }

 
  const aggregated: Record<
    string,
    { optionId: string; text: string; votes: number; isCorrect?: boolean }
  > = poll.options.reduce((acc, opt) => {
    if (!acc[opt.optionId]) {
      acc[opt.optionId] = {
        optionId: opt.optionId,
        text: opt.text,
        votes: opt.votes || 0,
        isCorrect: opt.isCorrect || false,
      };
    } else {
      acc[opt.optionId].votes += opt.votes || 0;
    }
    return acc;
  }, {} as Record<string, any>);

  const uniqueOptions = Object.values(aggregated);

  const totalVotes = uniqueOptions.reduce((sum, opt) => sum + opt.votes, 0);

  const results = uniqueOptions.map((opt) => ({
    optionId: opt.optionId,
    text: opt.text,
    percent: totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100),
    isCorrect: role === "TEACHER" ? opt.isCorrect || false : false,
  }));

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="title">Poll Results</h1>
        <button
          className="primary-btn view-results-btn"
          onClick={() => navigate("/poll/history")}
        >
          View History
        </button>
      </div>

      <div className="poll-card">
        <h2>{poll.question}</h2>
        <div className="poll-results">
          {results.map((r) => {
            const isCorrect = r.isCorrect === true;
            return (
              <div
                key={r.optionId}
                className={`result-row ${isCorrect ? "correct-answer" : ""}`}
              >
                <span className="result-text">{r.text}</span>
                <div className="bar">
                  <div style={{ width: `${r.percent}%` }} />
                </div>
                <span className="result-percent">{r.percent}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {poll.status === "ENDED" && <p className="subtitle">Poll has ended</p>}
    </div>
  );
}
