/**
 * 문구 가공 도구
 * - 해시태그·링크를 구분해 색을 입힐 수 있도록 조각으로 나눔
 * - 접힌 상태에서 보여줄 앞부분 계산
 */
const TOKEN_PATTERN = /(#[^\s#]+|https?:\/\/[^\s]+)/g;
const HASHTAG = /^#[^\s#]+$/;
const LINK = /^https?:\/\//;

/** 문구를 [일반 글자 / 해시태그 / 링크] 조각 배열로 변환 */
export function tokenize(text, { hashtags = false, links = false } = {}) {
  return text
    .split(TOKEN_PATTERN)
    .filter((part) => part !== '')
    .map((part) => {
      if (hashtags && HASHTAG.test(part)) return { type: 'tag', value: part };
      if (links && LINK.test(part)) return { type: 'link', value: part };
      return { type: 'text', value: part };
    });
}

/** 앞에서부터 lines줄만 잘라서 반환 (잘렸는지 여부 포함) */
export function getPreviewText(text, lines) {
  const all = text.split('\n');
  return {
    head: all.slice(0, lines).join('\n'),
    truncated: all.length > lines,
  };
}
