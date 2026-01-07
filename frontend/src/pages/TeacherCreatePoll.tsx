import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OptionItem from "../components/OptionItem";
import { v4 as uuid } from "uuid";
import type { Socket } from "socket.io-client";
import { SocketContext } from "../context/SocketContext";


interface CreatePollPayload {
  question: string;
  duration: number;
  options: {
    optionId: string;
    text: string;
    isCorrect: boolean;
  }[];
}

export default function TeacherCreatePoll() {
  const socket = useContext(SocketContext) as Socket | null;
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<
    { text: string; isCorrect: boolean }[]
  >([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [duration, setDuration] = useState(60);
  const [loading, setLoading] = useState(false);

  const canSubmit =
    question.trim().length > 0 &&
    options.filter((o) => o.text.trim().length > 0).length >= 2;


  useEffect(() => {
    socket?.emit("user_join", {
      name: "Teacher",
      role: "TEACHER",
    });
  }, [socket]);

  const handleCreatePoll = () => {
    if (!socket || !canSubmit) return;


    const hasCorrect = options.some((o) => o.isCorrect);
    if (!hasCorrect) {
      alert("Please select one correct answer");
      return;
    }

    setLoading(true);

    const payload: CreatePollPayload = {
      question,
      duration,
      options: options
        .filter((o) => o.text.trim().length > 0)
        .map((o) => ({
          optionId: uuid(),
          text: o.text,
          isCorrect: o.isCorrect,
        })),
    };

    socket.emit("create_poll", payload);

    
    setQuestion("");
    setOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
    setDuration(60);
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="title">Let's Get Started</h1>
        <button
          className="primary-btn view-results-btn"
          onClick={() => navigate("/poll/results")}
        >
          View Results
        </button>
      </div>

      <div className="form-section">
        <label className="form-label">Enter your question</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here..."
        />
      </div>

      <div className="form-section">
        <label className="form-label">Duration</label>
        <select
          value={duration}
          onChange={(e) => setDuration(+e.target.value)}
          className="duration-select"
        >
          <option value={10}>10 seconds</option>
          <option value={20}>20 seconds</option>
          <option value={30}>30 seconds</option>
          <option value={60}>60 seconds</option>
        </select>
      </div>

      <div className="form-section">
        <h3 className="section-title">Edit Options</h3>

        <div className="options-list">
          {options.map((opt, idx) => (
            <div key={idx} className="option-row">
              <div className="option-input-wrapper">
                <OptionItem
                  index={String(idx)}
                  value={opt.text}
                  onChange={(val) => {
                    const copy = [...options];
                    copy[idx].text = val;
                    setOptions(copy);
                  }}
                />
              </div>

              <div className="correct-answer-selector">
                <p className="correct-label">Is it Correct?</p>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      checked={opt.isCorrect}
                      onChange={() => {
                        const updated = options.map((o, i) => ({
                          ...o,
                          isCorrect: i === idx,
                        }));
                        setOptions(updated);
                      }}
                    />
                    <span>Yes</span>
                  </label>

                  <label className="radio-label">
                    <input
                      type="radio"
                      checked={!opt.isCorrect}
                      onChange={() => {
                        const copy = [...options];
                        copy[idx].isCorrect = false;
                        setOptions(copy);
                      }}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button
          className="secondary-btn"
          onClick={() =>
            setOptions([...options, { text: "", isCorrect: false }])
          }
        >
          + Add More Option
        </button>

        <button
          className="primary-btn"
          disabled={!canSubmit || loading}
          onClick={handleCreatePoll}
        >
          {loading ? "Starting Poll..." : "Ask Question"}
        </button>
      </div>
    </div>
  );
}
