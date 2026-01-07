export default function Timer({ seconds }: { seconds: number }) {
  return <span className="timer">Time: {seconds}s</span>;
}
