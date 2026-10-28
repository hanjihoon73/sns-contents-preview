import { Fragment, useState } from 'react';
import { getPreviewText, tokenize } from '../../utils/textFormat';

/**
 * 더 보기 / 접기 텍스트 (인스타·유튜브 공통)
 * - variant 'inline': 인스타처럼 "… 더 보기"가 문장 끝에 붙음
 * - variant 'block' : 유튜브처럼 "자세히 보기"가 아래 줄에 굵게 표시
 */
export default function CollapsibleText({
  text,
  previewLines,
  prefix = null,
  highlight = {},
  variant = 'inline',
  moreLabel,
  lessLabel,
  defaultExpanded = false,
  className = '',
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const { head, truncated } = getPreviewText(text, previewLines);
  const shown = expanded || !truncated ? text : head;

  return (
    <p className={className}>
      {prefix}
      {tokenize(shown, highlight).map((t, i) => {
        if (t.type === 'tag') return <span key={i} className="pv-tag">{t.value}</span>;
        if (t.type === 'link')
          return (
            <a key={i} href={t.value} target="_blank" rel="noopener noreferrer">
              {t.value}
            </a>
          );
        return <Fragment key={i}>{t.value}</Fragment>;
      })}
      {truncated && !expanded && variant === 'inline' && '… '}
      {truncated && (
        <button
          type="button"
          className={`pv-toggle pv-toggle--${variant}${expanded ? ' is-expanded' : ''}`}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? lessLabel : moreLabel}
        </button>
      )}
    </p>
  );
}
