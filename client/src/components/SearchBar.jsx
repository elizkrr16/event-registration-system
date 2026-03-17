import Input from './Input';

function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form
      className="search-bar"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Input
        label="Поиск"
        placeholder="Введите название мероприятия"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </form>
  );
}

export default SearchBar;
