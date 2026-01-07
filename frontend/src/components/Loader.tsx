export default function Loader({ text }: { text: string }) {
  return (
    <div className="page-center">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}
