/**
 * 글자수 / 해시태그 / 장수 / 비율 경고 뱃지
 * status: 'ok' | 'warn' | 'over' | 'info'
 */
export default function LimitBadge({ label, current, max, status = 'ok', message = '' }) {
  let badgeClass = 'limit-badge';
  if (status === 'over') badgeClass += ' limit-badge--danger';
  else if (status === 'warn') badgeClass += ' limit-badge--warn';
  else if (status === 'info') badgeClass += ' limit-badge--info';

  const isNumeric = max !== undefined && max !== null;

  return (
    <span className={badgeClass}>
      <span className="limit-badge__label">{label}</span>
      {isNumeric ? (
        <span className="limit-badge__value">
          {Number(current).toLocaleString()} / {Number(max).toLocaleString()}
        </span>
      ) : (
        <span className="limit-badge__value">{current}</span>
      )}
      {message && <span className="limit-badge__msg">({message})</span>}
    </span>
  );
}
