import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={css.inputWrapper}>
      <input
        className={css.input}
        type="text"
        placeholder="Search notes"
        value={value}
        onChange={handleChange}
      />
      {value.length > 0 && (
        <button type="button" onClick={handleClear} className={css.clear}>
          ×
        </button>
      )}
    </div>
  );
}
