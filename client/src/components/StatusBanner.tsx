export function StatusBanner({
  tone,
  message,
}: {
  tone: 'success' | 'error' | 'info';
  message: string;
}) {
  return <div className={`status-banner ${tone}`}>{message}</div>;
}
