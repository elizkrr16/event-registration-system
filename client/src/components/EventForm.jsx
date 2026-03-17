import Button from './Button';
import Input from './Input';

function EventForm({ form, categories, onChange, onSubmit, submitText }) {
  return (
    <form className="card event-form" onSubmit={onSubmit}>
      <div className="event-form__grid">
        <Input label="Название" value={form.title} onChange={(event) => onChange('title', event.target.value)} required />
        <Input
          label="Краткое описание"
          value={form.short_description}
          onChange={(event) => onChange('short_description', event.target.value)}
          required
        />
      </div>
      <Input label="Описание" textarea value={form.description} onChange={(event) => onChange('description', event.target.value)} required />
      <Input label="Программа" textarea value={form.program} onChange={(event) => onChange('program', event.target.value)} required />

      <div className="event-form__grid">
        <Input label="Город" value={form.city} onChange={(event) => onChange('city', event.target.value)} required />
        <Input label="Место проведения" value={form.location} onChange={(event) => onChange('location', event.target.value)} required />
        <label className="field">
          <span className="field__label">Формат</span>
          <select className="field__control" value={form.format} onChange={(event) => onChange('format', event.target.value)}>
            <option value="offline">Офлайн</option>
            <option value="online">Онлайн</option>
            <option value="hybrid">Гибрид</option>
          </select>
        </label>
        <label className="field">
          <span className="field__label">Категория</span>
          <select className="field__control" value={form.category_id} onChange={(event) => onChange('category_id', event.target.value)}>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <Input
          label="Дата и время начала"
          type="datetime-local"
          value={form.starts_at}
          onChange={(event) => onChange('starts_at', event.target.value)}
          required
        />
        <Input
          label="Дата и время окончания"
          type="datetime-local"
          value={form.ends_at}
          onChange={(event) => onChange('ends_at', event.target.value)}
          required
        />
        <Input
          label="Вместимость"
          type="number"
          min="1"
          value={form.capacity}
          onChange={(event) => onChange('capacity', event.target.value)}
          required
        />
        <label className="field">
          <span className="field__label">Статус</span>
          <select className="field__control" value={form.status} onChange={(event) => onChange('status', event.target.value)}>
            <option value="draft">Черновик</option>
            <option value="published">Опубликовано</option>
            <option value="closed">Закрыто</option>
            <option value="cancelled">Отменено</option>
          </select>
        </label>
      </div>

      <Button type="submit">{submitText}</Button>
    </form>
  );
}

export default EventForm;
