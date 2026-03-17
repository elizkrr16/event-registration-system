function NotificationBlock({ type = 'info', title, message }) {
  if (!message) {
    return null;
  }

  return (
    <div className={`notification notification--${type}`}>
      {title ? <strong>{title}</strong> : null}
      <span>{message}</span>
    </div>
  );
}

export default NotificationBlock;
