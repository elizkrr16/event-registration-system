function Input({ label, error, textarea = false, className = '', ...props }) {
  const Element = textarea ? 'textarea' : 'input';

  return (
    <label className={`field ${className}`.trim()}>
      {label && <span className="field__label">{label}</span>}
      <Element className="field__control" {...props} />
      {error && <span className="field__error">{error}</span>}
    </label>
  );
}

export default Input;
