interface Props {
  index: string;
  value: string;
  onChange?: (v: string) => void;
  selectable?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export default function OptionItem({
  index,
  value,
  onChange,
  selected,
  onClick,
}: Props) {
  return (
    <div
      className={`option-item ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <span>{index + 1}</span>
      {onChange ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <p>{value}</p>
      )}
    </div>
  );
}
