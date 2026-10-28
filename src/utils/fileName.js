/**
 * 단일 HTML 내보내기 파일명 생성
 * 규칙: SNS콘텐츠프리뷰_YYMMDD.html (예: 2026년 10월 28일 -> SNS콘텐츠프리뷰_261028.html)
 */
export function getExportFileName(date = new Date()) {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `SNS콘텐츠프리뷰_${yy}${mm}${dd}.html`;
}
