import { useEffect, useState } from "react";
import PollCard from "../components/PollCard";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

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
}

export default function PollHistory() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:5000/polls/history")
      .then((res) => res.json())
      .then((data) => {
        setPolls(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader text="Loading poll history..." />;
  }

  if (polls.length === 0) {
    return <p className="page-center">No polls conducted yet.</p>;
  }

  return (
    <div className="page">
      <h1 className="title">Poll History</h1>
       <button
          className="primary-btn view-results-btn"
          onClick={() => navigate("/teacher/create")}
        >
          Ask Questions
        </button>

      <div className="poll-history-list">
        {polls.map((poll) => {
          // Aggregate options by optionId in case duplicates exist
          const aggregated = poll.options.reduce(
            (acc: Record<string, any>, opt) => {
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
            },
            {} as Record<string, any>
          );

          const unique = Object.values(aggregated);

          const totalVotes = unique.reduce((sum, opt) => sum + opt.votes, 0);

          const results = unique.map((opt) => ({
            optionId: opt.optionId,
            text: opt.text,
            percent:
              totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100),
            isCorrect: opt.isCorrect || false,
          }));

          return (
            <PollCard
              key={poll._id}
              question={poll.question}
              results={results}
            />
          );
        })}
      </div>
    </div>
  );
}
