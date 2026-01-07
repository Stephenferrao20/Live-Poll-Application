import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import Timer from "../components/Timer";
import OptionItem from "../components/OptionItem";
import Loader from "../components/Loader";


interface Option {
  optionId: string;
  text: string;
  votes?: number;
}

interface Poll {
  _id: string;
  question: string;
  options: Option[];
  duration: number;
}

export default function LivePoll() {
  const socket = useContext(SocketContext);

  const [poll, setPoll] = useState<Poll | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.emit("get_active_poll");

    socket.on("poll_state", ({ poll, remainingTime }) => {
      setPoll(poll);
      setRemainingTime(remainingTime);
    });

    socket.on("poll_started", ({ poll, remainingTime }) => {
      setPoll(poll);
      setRemainingTime(remainingTime);
      setSelected(null);
      setHasVoted(false);
    });

    socket.on("poll_update", (updatedPoll) => {
      setPoll(updatedPoll);
    });

    return () => {
      socket.off("poll_state");
      socket.off("poll_started");
      socket.off("poll_update");
    };
  }, [socket]);

  useEffect(() => {
  if (!socket) return;

  const name = sessionStorage.getItem("name");
  const role = sessionStorage.getItem("role");

  if (name && role) {
    socket.emit("user_join", { name, role });
  }
}, [socket]);


  
  useEffect(() => {
    if (!remainingTime) return;

    const timer = setInterval(() => {
      setRemainingTime((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  
  const submitVote = () => {
    if (!socket || !poll || !selected || hasVoted) return;

    socket.emit("submit_vote", {
      pollId: poll._id,
      optionId: selected,
      studentId: sessionStorage.getItem("name"),
    });

    setHasVoted(true);
  };

  
  if (!poll) {
    return <Loader text="Wait for the teacher to ask a question..." />;
  }

  return (
    <div className="page">
      <div className="live-poll-header">
        <h1 className="title">Live Question</h1>
        <Timer seconds={remainingTime} />
      </div>

      <div className="poll-card">
        <h2>{poll.question}</h2>

        <div className="options-container">
          {poll.options.map((opt) => (
            <OptionItem
              key={opt.optionId}
              index={opt.optionId}
              value={opt.text}
              selectable={!hasVoted && remainingTime > 0}
              selected={selected === opt.optionId}
              onClick={() => setSelected(opt.optionId)}
            />
          ))}
        </div>
      </div>

      <div className="submit-section">
        <button
          className="primary-btn"
          disabled={!selected || hasVoted || remainingTime === 0}
          onClick={submitVote}
        >
          {hasVoted ? "Answer Submitted" : "Submit Answer"}
        </button>
        {hasVoted && (
          <p className="submission-message">Your answer has been submitted successfully.</p>
        )}
      </div>
    </div>
  );
}
