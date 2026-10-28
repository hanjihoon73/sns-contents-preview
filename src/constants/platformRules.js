/**
 * 플랫폼별 제한값 (2026년 10월 기준)
 * 정책이 바뀌면 이 파일의 숫자만 고치면 됩니다.
 */
export const PLATFORM_RULES = {
  ig: {
    key: 'ig',
    label: 'INSTAGRAM',
    feedName: '피드',
    maxChars: 2200,
    maxHashtags: 30,
    maxImages: 20,
    ratios: ['4:5', '1:1'], // 허용 비율 (첫 번째가 권장)
    defaultAspect: 4 / 5, // 이미지가 없을 때 빈 영역 비율
    previewLines: 1, // 접힌 상태에서 보이는 줄 수
  },
  yt: {
    key: 'yt',
    label: 'YOUTUBE',
    feedName: '커뮤니티 게시물',
    maxChars: 5000,
    maxHashtags: null, // 제한 없음
    maxImages: 10,
    ratios: ['1:1'],
    defaultAspect: 1,
    previewLines: 1, // 접힌 상태에서 제목(첫 줄)만 보이고 바로 아래 '자세히 보기'
  },
};
