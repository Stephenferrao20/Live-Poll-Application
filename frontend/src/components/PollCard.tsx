interface Result {
  optionId?: string;
  text: string;
  percent: number;
  isCorrect?: boolean;
}

export default function PollCard({
  question,
  results,
}: {
  question: string;
  results: Result[];
}) {
  return (
    <div className="poll-card">
      <h2>{question}</h2>
      <div className="poll-results">
        {results.map((r, i) => {
          const isCorrect = r.isCorrect === true;
          return (
            <div
              key={r.optionId || i}
              className={`result-row ${isCorrect ? "correct-answer" : ""}`}
            >
              <span className="result-text">
                {r.text}
              </span>
              <div className="bar">
                <div style={{ width: `${r.percent}%` }} />
              </div>
              <span className="result-percent">{r.percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
