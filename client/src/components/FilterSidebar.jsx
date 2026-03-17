import Button from './Button';
import Input from './Input';

function FilterSidebar({ filters, categories, onChange, onReset, onSubmit }) {
  return (
    <aside className="filter-sidebar card">
      <div className="section-kicker">Фильтры</div>
      <Input
        label="Дата"
        type="date"
        value={filters.date}
        onChange={(event) => onChange('date', event.target.value)}
      />

      <label className="field">
        <span className="field__label">Категория</span>
        <select
          className="field__control"
          value={filters.category_id}
          onChange={(event) => onChange('category_id', event.target.value)}
        >
          <option value="">Все категории</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field__label">Формат</span>
        <select
          className="field__control"
          value={filters.format}
          onChange={(event) => onChange('format', event.target.value)}
        >
          <option value="">Все форматы</option>
          <option value="online">Онлайн</option>
          <option value="offline">Офлайн</option>
          <option value="hybrid">Гибрид</option>
        </select>
      </label>

      <Input
        label="Город"
        placeholder="Например, Красноярск"
        value={filters.city}
        onChange={(event) => onChange('city', event.target.value)}
      />

      <div className="stack-row">
        <Button type="button" onClick={onSubmit}>
          Применить
        </Button>
        <Button type="button" variant="ghost" onClick={onReset}>
          Сбросить
        </Button>
      </div>
    </aside>
  );
}

export default FilterSidebar;
