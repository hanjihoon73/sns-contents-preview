import { getExportFileName } from './fileName.js';
import { countChars, countHashtags } from './validators.js';

/**
 * 특수문자 HTML 이스케이프 (작은따옴표는 본문에서 안전하므로 유지하고 기존 &#39;는 작은따옴표로 복원)
 */
function escapeHtml(str = '') {
  return String(str)
    .replace(/&#39;/g, "'")
    .replace(/[&<>"]/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
    }[c]));
}

/* ----- 루시드 및 플랫폼 고해상도 인라인 SVG 아이콘 ----- */
const LUCIDE_SUN_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
const LUCIDE_MOON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;

const IG_HEART_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938Z"/></svg>`;
const IG_COMMENT_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"/></svg>`;
const IG_SEND_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="3" x2="9.218" y2="10.083"/><polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"/></svg>`;
const IG_BOOKMARK_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21"/></svg>`;
const IG_MORE_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>`;

const YT_THUMB_UP_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.12 2.06 7.58 7.6c-.37.37-.58.88-.58 1.41V19c0 1.1.9 2 2 2h9c.8 0 1.52-.48 1.84-1.21l3.26-7.61C23.94 10.2 22.49 8 20.34 8h-5.65l.95-4.58c.1-.5-.05-1.01-.41-1.37-.59-.58-1.53-.58-2.11.01ZM3 21c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2s-2 .9-2 2v8c0 1.1.9 2 2 2Z"/></svg>`;
const YT_THUMB_DOWN_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="transform:rotate(180deg)"><path d="M13.12 2.06 7.58 7.6c-.37.37-.58.88-.58 1.41V19c0 1.1.9 2 2 2h9c.8 0 1.52-.48 1.84-1.21l3.26-7.61C23.94 10.2 22.49 8 20.34 8h-5.65l.95-4.58c.1-.5-.05-1.01-.41-1.37-.59-.58-1.53-.58-2.11.01ZM3 21c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2s-2 .9-2 2v8c0 1.1.9 2 2 2Z"/></svg>`;
const YT_COMMENT_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Zm0 14H6l-2 2V4h16v12Z"/></svg>`;
const YT_SHARE_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15 5.63 20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9Z"/></svg>`;
const YT_MORE_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg>`;

const VIDEO_PLAY_SVG = `<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.55.83l10.29-6.86a1 1 0 0 0 0-1.66L9.55 4.31A1 1 0 0 0 8 5.14Z"/></svg>`;
const VIDEO_MUTE_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
const VIDEO_UNMUTE_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;

/**
 * Blob 객체를 Base64 DataURL로 변환
 */
function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Blob 변환 실패'));
    reader.readAsDataURL(blob);
  });
}

/**
 * 이미지/비디오 URL 또는 Blob을 Base64 DataURL로 변환 (상대 경로 / 외부 URL / Blob 대응)
 */
async function toDataUrl(src, blob = null) {
  if (blob instanceof Blob) {
    try {
      return await blobToDataUrl(blob);
    } catch (err) {
      console.warn('Blob DataURL 변환 실패:', err);
    }
  }
  if (!src) return '';
  if (src.startsWith('data:')) return src;

  try {
    const res = await fetch(src);
    const fetchedBlob = await res.blob();
    return await blobToDataUrl(fetchedBlob);
  } catch (err) {
    console.warn('DataURL 변환 실패:', src, err);
    return src;
  }
}

/**
 * 미디어 아이템 배열을 단일 HTML 내장용 객체 배열로 변환
 */
async function serializeMediaItems(items = []) {
  return Promise.all(
    items.map(async (item) => {
      const dataUrl = await toDataUrl(item.src, item.blob);
      const posterUrl =
        item.type === 'video' && item.thumbnail
          ? await toDataUrl(item.thumbnail)
          : '';
      return {
        type: item.type === 'video' ? 'video' : 'image',
        src: dataUrl,
        poster: posterUrl,
        width: item.width || 0,
        height: item.height || 0,
      };
    })
  );
}

/**
 * 단일 독립 실행형 HTML 문자열 비동기 생성 (모든 이미지·동영상 Base64 임베딩)
 */
export async function generateSingleHtml(data) {
  const { profile, ig, yt } = data;
  const name = profile.name || '계정 이름';
  const fileName = getExportFileName();
  const title = fileName.replace('.html', '');

  const igCharCount = countChars(ig.text);
  const igTagCount = countHashtags(ig.text);
  const ytCharCount = countChars(yt.text);

  // 1. 모든 이미지 및 동영상을 완전한 Base64 DataURL로 변환 (오프라인 로컬 실행 100% 보장)
  const avatarDataUrl = await toDataUrl(profile.avatar);
  const igMedia = await serializeMediaItems(ig.images);
  const ytMedia = await serializeMediaItems(
    (yt.images || []).filter((item) => item.type !== 'video')
  );

  const igFirst = igMedia[0];
  const igAspectStyle =
    igFirst && igFirst.width && igFirst.height
      ? `${igFirst.width} / ${igFirst.height}`
      : '4 / 5';

  const ytFirst = ytMedia[0];
  const ytAspectStyle =
    ytFirst && ytFirst.width && ytFirst.height
      ? `${ytFirst.width} / ${ytFirst.height}`
      : '1 / 1';

  // 프로필 아바타 HTML
  const initials = (name || '?').trim().slice(0, 2);
  const igAvatarHtml = avatarDataUrl
    ? `<div class="pv-avatar pv-avatar--ring" style="width:36px;height:36px"><div class="pv-avatar__inner pv-avatar__inner--has-img"><img src="${avatarDataUrl}" alt="" /></div></div>`
    : `<div class="pv-avatar pv-avatar--ring" style="width:36px;height:36px"><div class="pv-avatar__inner"><span>${escapeHtml(initials)}</span></div></div>`;

  const ytAvatarHtml = avatarDataUrl
    ? `<div class="pv-avatar" style="width:36px;height:36px"><div class="pv-avatar__inner pv-avatar__inner--has-img"><img src="${avatarDataUrl}" alt="" /></div></div>`
    : `<div class="pv-avatar" style="width:36px;height:36px"><div class="pv-avatar__inner"><span>${escapeHtml(initials)}</span></div></div>`;

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · 발행 미리보기</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
<style>
  :root {
    --font: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif;
    --app-bg: #EEF0F3;
    --pv-card: #FFFFFF;
    --pv-text: #0F1419;
    --pv-muted: #65676B;
    --pv-line: #E4E6EB;
    --pv-ig-link: #00376B;
    --pv-yt-link: #065FD4;
    --pv-dot: #C7C9CE;
    --pv-dot-on: #0095F6;
    --pv-empty: #F0F1F4;
    --btn-border: #D0D5DD;
    --btn-bg: #FFFFFF;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --app-bg: #0B0C0F;
      --pv-card: #000000;
      --pv-text: #F5F5F5;
      --pv-muted: #A8A8A8;
      --pv-line: #262626;
      --pv-ig-link: #E0F1FF;
      --pv-yt-link: #3EA6FF;
      --pv-dot: #4A4A4A;
      --pv-empty: #121212;
      --btn-border: #344054;
      --btn-bg: #16181C;
    }
  }
  :root[data-theme="dark"] {
    --app-bg: #0B0C0F;
    --pv-card: #000000;
    --pv-text: #F5F5F5;
    --pv-muted: #A8A8A8;
    --pv-line: #262626;
    --pv-ig-link: #E0F1FF;
    --pv-yt-link: #3EA6FF;
    --pv-dot: #4A4A4A;
    --pv-empty: #121212;
    --btn-border: #344054;
    --btn-bg: #16181C;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--app-bg);
    color: var(--pv-text);
    font-family: var(--font);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  header.top {
    max-width: 1180px;
    margin: 0 auto;
    padding: 28px 20px 12px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 16px;
    flex-wrap: wrap;
  }
  header.top h1 { font-size: 20px; font-weight: 800; }
  header.top p { margin-top: 4px; color: var(--pv-muted); font-size: 13.5px; }

  .theme-btn {
    border: 1px solid var(--btn-border);
    background: var(--btn-bg);
    color: var(--pv-text);
    border-radius: 999px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  main {
    max-width: 1180px;
    margin: 0 auto;
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
    gap: 36px;
    align-items: start;
  }

  .pv-section { display: flex; flex-direction: column; align-items: center; }
  .pv-label {
    width: 100%;
    max-width: 470px;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 12.5px;
    font-weight: 700;
    letter-spacing: .04em;
    color: var(--pv-muted);
  }
  .pv-label__dot { width: 8px; height: 8px; border-radius: 50%; }
  .pv-label__dot--ig { background: linear-gradient(45deg, #F58529, #DD2A7B, #8134AF); }
  .pv-label__dot--yt { background: #FF0033; }

  .pv-post {
    width: 100%;
    max-width: 470px;
    background: var(--pv-card);
    color: var(--pv-text);
    border: 1px solid var(--pv-line);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 8px 24px -8px rgba(0,0,0,0.12);
  }

  .pv-head { display: flex; align-items: center; gap: 10px; padding: 12px 14px; }
  .pv-name { font-weight: 700; font-size: 14px; }
  .pv-sub { font-weight: 400; font-size: 12px; color: var(--pv-muted); }
  .pv-more { margin-left: auto; color: var(--pv-text); display: grid; place-items: center; }

  .pv-avatar { border-radius: 50%; flex-shrink: 0; display: grid; place-items: center; }
  .pv-avatar--ring { padding: 2px; background: conic-gradient(from 210deg, #F58529, #DD2A7B, #8134AF, #515BD4, #F58529); }
  .pv-avatar__inner {
    width: 100%; height: 100%; border-radius: 50%; overflow: hidden;
    display: grid; place-items: center; background: #F5B83D; color: #14110D;
    font-weight: 800; font-size: 12px;
  }
  .pv-avatar__inner--has-img { background: var(--pv-card); }
  .pv-avatar--ring .pv-avatar__inner { border: 2px solid var(--pv-card); }
  .pv-avatar__inner img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* 캐러셀 */
  .pv-carousel { position: relative; background: #000; overflow: hidden; touch-action: pan-y; }
  .pv-track { display: flex; height: 100%; transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1); }
  .pv-slide, .pv-track > img { width: 100%; height: 100%; flex-shrink: 0; position: relative; }
  .pv-slide img, .pv-slide video, .pv-track > img { width: 100%; height: 100%; object-fit: cover; display: block; user-select: none; }
  .pv-slide--video { cursor: pointer; }
  .pv-video-play-btn {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 54px; height: 54px; border-radius: 50%;
    background: rgba(0,0,0,0.55); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
    color: #fff; display: grid; place-items: center; pointer-events: none;
    box-shadow: 0 4px 14px rgba(0,0,0,0.35);
  }
  .pv-video-mute-btn {
    position: absolute; bottom: 12px; right: 12px;
    width: 30px; height: 30px; border-radius: 50%; border: 0;
    background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
    color: #fff; display: grid; place-items: center; cursor: pointer; z-index: 2;
  }
  .pv-carousel--empty { display: grid; place-items: center; background: var(--pv-empty); color: var(--pv-muted); font-size: 13px; }

  .pv-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 30px; height: 30px; border-radius: 50%; border: 0;
    background: rgba(255,255,255,0.88); color: #111; font-size: 18px;
    line-height: 1; cursor: pointer; display: grid; place-items: center;
    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }
  .pv-nav--prev { left: 10px; }
  .pv-nav--next { right: 10px; }
  .pv-count {
    position: absolute; top: 12px; right: 12px;
    background: rgba(0,0,0,0.6); color: #fff; font-size: 12px;
    padding: 3px 9px; border-radius: 999px;
  }

  .theme-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 36px;
    padding: 0 14px;
    background: var(--btn-bg);
    color: var(--pv-text);
    border: 1px solid var(--btn-border);
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .theme-btn:hover { filter: brightness(0.96); }
  .theme-btn__icon { display: flex; align-items: center; }

  /* 인스타 액션 바 */
  .pv-ig-actions { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 8px 14px 0; }
  .pv-ig-actions__left { display: flex; gap: 14px; align-items: center; }
  .pv-ig-actions__left span, .pv-ig-actions__right span { display: inline-flex; align-items: center; cursor: pointer; color: var(--pv-text); }
  .pv-ig-actions__right { justify-self: end; }
  .pv-dots { display: flex; gap: 4px; }
  .pv-dots i { width: 6px; height: 6px; border-radius: 50%; background: var(--pv-dot); }
  .pv-dots i.on { background: var(--pv-dot-on); }
  .pv-ig-likes { padding: 8px 14px 0; font-size: 14px; font-weight: 700; }
  .pv-ig-caption {
    margin: 0; padding: 6px 14px 4px; font-size: 14px; line-height: 1.5;
    white-space: pre-wrap; word-break: keep-all; overflow-wrap: anywhere;
  }
  .pv-ig-time { padding: 4px 14px 14px; font-size: 11px; color: var(--pv-muted); }

  /* 유튜브 */
  .pv-yt-text {
    margin: 0; padding: 0 16px 12px; font-size: 14px; line-height: 1.55;
    white-space: pre-wrap; word-break: keep-all; overflow-wrap: anywhere;
  }
  .pv-yt .pv-carousel { margin: 0 16px; border-radius: 10px; }
  .pv-yt-bar {
    display: flex; align-items: center; gap: 20px; padding: 12px 16px 14px;
    font-size: 13px; color: var(--pv-muted);
  }
  .pv-yt-bar span { display: flex; align-items: center; gap: 6px; color: var(--pv-muted); }
  .pv-yt-bar span svg { display: block; }
  .pv-yt-bar__share { margin-left: auto; cursor: pointer; }

  .pv-tag { color: var(--pv-ig-link); }
  .pv-yt-text a, .pv-yt-text .pv-tag { color: var(--pv-yt-link); text-decoration: none; }

  .pv-toggle { background: none; border: 0; padding: 0; font: inherit; cursor: pointer; color: var(--pv-muted); }
  .pv-toggle--block { display: block; margin-top: 6px; font-weight: 700; color: var(--pv-text); }
  .pv-toggle--inline.is-expanded { display: block; margin-top: 4px; }

  .pv-meta { width: 100%; max-width: 470px; margin-top: 12px; padding: 0 4px; font-size: 12px; color: var(--pv-muted); }
  footer { max-width: 1180px; margin: 32px auto 48px; text-align: center; color: var(--pv-muted); font-size: 12px; }
</style>
</head>
<body>
<header class="top">
  <div>
    <h1>${title} · 발행 미리보기</h1>
    <p>계정: ${escapeHtml(name)} · 인스타그램 피드 & 유튜브 커뮤니티</p>
  </div>
  <button class="theme-btn" id="theme-btn" type="button" aria-label="테마 전환" title="테마 전환">
    <span class="theme-btn__icon" id="theme-btn-icon"></span>
    <span id="theme-btn-text">다크 모드</span>
  </button>
</header>

<main>
  <!-- 인스타그램 -->
  <section class="pv-section">
    <h2 class="pv-label">
      <span class="pv-label__dot pv-label__dot--ig"></span>
      INSTAGRAM · 피드 (${igMedia.length}개)
    </h2>
    <article class="pv-post pv-ig">
      <header class="pv-head">
        ${igAvatarHtml}
        <div class="pv-name">${escapeHtml(name)}</div>
        <span class="pv-more">${IG_MORE_SVG}</span>
      </header>

      <div class="pv-carousel" id="ig-carousel" style="aspect-ratio: ${igAspectStyle};">
        <div class="pv-track"></div>
        <span class="pv-count"></span>
        <button type="button" class="pv-nav pv-nav--prev">‹</button>
        <button type="button" class="pv-nav pv-nav--next">›</button>
      </div>

      <div class="pv-ig-actions">
        <div class="pv-ig-actions__left">
          <span title="좋아요">${IG_HEART_SVG}</span>
          <span title="댓글">${IG_COMMENT_SVG}</span>
          <span title="공유">${IG_SEND_SVG}</span>
        </div>
        <div class="pv-dots" id="ig-dots"></div>
        <div class="pv-ig-actions__right">
          <span title="저장">${IG_BOOKMARK_SVG}</span>
        </div>
      </div>

      <div class="pv-ig-likes">좋아요 0개</div>
      <p class="pv-ig-caption" id="ig-caption"></p>
      <div class="pv-ig-time">방금 전</div>
    </article>
    <p class="pv-meta">
      캡션 ${igCharCount.toLocaleString()} / 2,200자 · 해시태그 ${igTagCount} / 30개 · 미디어 ${igMedia.length} / 20개
    </p>
  </section>

  <!-- 유튜브 -->
  <section class="pv-section">
    <h2 class="pv-label">
      <span class="pv-label__dot pv-label__dot--yt"></span>
      YOUTUBE · 커뮤니티 게시물 (${ytMedia.length}장)
    </h2>
    <article class="pv-post pv-yt">
      <header class="pv-head">
        ${ytAvatarHtml}
        <div class="pv-name">${escapeHtml(name)} <span class="pv-sub">· 방금 전</span></div>
        <span class="pv-more">${YT_MORE_SVG}</span>
      </header>

      <p class="pv-yt-text" id="yt-text"></p>

      <div class="pv-carousel" id="yt-carousel" style="aspect-ratio: ${ytAspectStyle};">
        <div class="pv-track"></div>
        <span class="pv-count"></span>
        <button type="button" class="pv-nav pv-nav--prev">‹</button>
        <button type="button" class="pv-nav pv-nav--next">›</button>
      </div>

      <div class="pv-yt-bar">
        <span>${YT_THUMB_UP_SVG} 0</span>
        <span>${YT_THUMB_DOWN_SVG} 0</span>
        <span>${YT_COMMENT_SVG} 0</span>
        <span class="pv-yt-bar__share" title="공유">${YT_SHARE_SVG}</span>
      </div>
    </article>
    <p class="pv-meta">
      본문 ${ytCharCount.toLocaleString()} / 5,000자 · 이미지 ${ytMedia.length}장
    </p>
  </section>
</main>

<footer>※ 실제 앱 화면의 줄바꿈·'더 보기' 위치는 기기마다 조금 다를 수 있습니다.</footer>

<script>
/* 0. 필수 유틸 함수 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&#39;/g, "'")
    .replace(/[&<>"]/g, function(c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];
    });
}

/* 데이터 주입 */
const DATA = {
  name: ${JSON.stringify(name)},
  igText: ${JSON.stringify(ig.text)},
  ytText: ${JSON.stringify(yt.text)},
  igMedia: ${JSON.stringify(igMedia)},
  ytMedia: ${JSON.stringify(ytMedia)}
};

const PLAY_SVG = ${JSON.stringify(VIDEO_PLAY_SVG)};
const MUTE_SVG = ${JSON.stringify(VIDEO_MUTE_SVG)};
const UNMUTE_SVG = ${JSON.stringify(VIDEO_UNMUTE_SVG)};

/* 텍스트 포맷터: 링크와 해시태그 색칠 */
function formatText(str, opts) {
  opts = opts || {};
  var s = escapeHtml(str || '');
  if (opts.links) {
    s = s.replace(/(https?:\\\/\\\/[^\\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1<\\/a>');
  }
  if (opts.hashtags) {
    s = s.replace(/(#[^\\s#]+)/g, '<span class="pv-tag">$1<\\/span>');
  }
  return s;
}

/* 1. 인스타그램 & 유튜브 캐러셀 초기화 (이미지·비디오 혼합 지원) */
function initCarousel(id, dotsId, items) {
  var el = document.getElementById(id);
  if (!el) return;
  var track = el.querySelector('.pv-track');
  var countEl = el.querySelector('.pv-count');
  var prevBtn = el.querySelector('.pv-nav--prev');
  var nextBtn = el.querySelector('.pv-nav--next');
  var dotsEl = dotsId ? document.getElementById(dotsId) : null;

  if (!items || items.length === 0) {
    el.innerHTML = '<div class="pv-carousel--empty" style="height:100%">등록된 미디어가 없습니다</div>';
    return;
  }

  var isMuted = true;
  var videoSlides = [];

  function syncMuteUI() {
    videoSlides.forEach(function(vs) {
      vs.video.muted = isMuted;
      vs.muteBtn.innerHTML = isMuted ? MUTE_SVG : UNMUTE_SVG;
      vs.muteBtn.setAttribute('title', isMuted ? '소리 켜기' : '음소거');
    });
  }

  items.forEach(function(item, idx) {
    var isObj = item && typeof item === 'object';
    var type = isObj ? item.type : 'image';
    var src = isObj ? item.src : item;
    var poster = isObj ? item.poster : '';

    var slide = document.createElement('div');
    slide.className = 'pv-slide' + (type === 'video' ? ' pv-slide--video' : '');

    if (type === 'video') {
      var video = document.createElement('video');
      video.src = src;
      if (poster) video.poster = poster;
      video.muted = isMuted;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.preload = 'metadata';

      var playBtn = document.createElement('span');
      playBtn.className = 'pv-video-play-btn';
      playBtn.innerHTML = PLAY_SVG;

      var muteBtn = document.createElement('button');
      muteBtn.type = 'button';
      muteBtn.className = 'pv-video-mute-btn';
      muteBtn.innerHTML = MUTE_SVG;
      muteBtn.onclick = function(e) {
        e.stopPropagation();
        isMuted = !isMuted;
        syncMuteUI();
      };

      video.onplay = function() { playBtn.style.display = 'none'; };
      video.onpause = function() { playBtn.style.display = 'grid'; };

      slide.onclick = function() {
        if (video.paused) {
          video.play().catch(function() {});
        } else {
          video.pause();
        }
      };

      slide.appendChild(video);
      slide.appendChild(playBtn);
      slide.appendChild(muteBtn);
      videoSlides.push({ index: idx, video: video, playBtn: playBtn, muteBtn: muteBtn });
    } else {
      var img = document.createElement('img');
      img.src = src;
      img.alt = (idx + 1) + '번째 이미지';
      img.draggable = false;
      slide.appendChild(img);
    }

    track.appendChild(slide);

    if (dotsEl && items.length > 1) {
      var dot = document.createElement('i');
      if (idx === 0) dot.className = 'on';
      dotsEl.appendChild(dot);
    }
  });

  var cur = 0;
  function update(n) {
    cur = Math.max(0, Math.min(items.length - 1, n));
    track.style.transform = 'translateX(-' + (cur * 100) + '%)';
    if (countEl) {
      countEl.style.display = items.length > 1 ? 'block' : 'none';
      countEl.textContent = (cur + 1) + '/' + items.length;
    }
    if (prevBtn) prevBtn.style.display = cur === 0 ? 'none' : 'grid';
    if (nextBtn) nextBtn.style.display = cur === items.length - 1 ? 'none' : 'grid';
    if (dotsEl) {
      for (var i = 0; i < dotsEl.children.length; i++) {
        dotsEl.children[i].className = i === cur ? 'on' : '';
      }
    }

    // 현재 슬라이드가 비디오면 자동 재생, 다른 비디오는 일시정지
    videoSlides.forEach(function(vs) {
      if (vs.index === cur) {
        var p = vs.video.play();
        if (p && p.catch) p.catch(function() {});
      } else {
        vs.video.pause();
      }
    });
  }

  if (prevBtn) prevBtn.onclick = function() { update(cur - 1); };
  if (nextBtn) nextBtn.onclick = function() { update(cur + 1); };

  // 터치 스와이프
  var startX = null;
  el.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', function(e) {
    if (startX === null) return;
    var diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) update(cur + (diff < 0 ? 1 : -1));
    startX = null;
  });

  update(0);
}

initCarousel('ig-carousel', 'ig-dots', DATA.igMedia);
initCarousel('yt-carousel', null, DATA.ytMedia);

/* 2. 인스타 캡션 접기/펼치기 (첫 줄 + 더 보기) */
(function() {
  var box = document.getElementById('ig-caption');
  if (!box) return;
  var full = DATA.igText || '';
  if (!full) { box.innerHTML = '<span style="color:var(--pv-muted)">캡션을 입력하면 여기에 표시돼요</span>'; return; }

  var lines = full.split('\\n');
  var firstLine = lines[0];
  var isMulti = lines.length > 1;

  function renderCollapsed() {
    box.innerHTML = '<b>' + escapeHtml(DATA.name) + ' </b>' + formatText(firstLine, { hashtags: true }) +
      (isMulti ? '… <button type="button" class="pv-toggle pv-toggle--inline">더 보기</button>' : '');
    var btn = box.querySelector('button');
    if (btn) btn.onclick = renderExpanded;
  }

  function renderExpanded() {
    box.innerHTML = '<b>' + escapeHtml(DATA.name) + ' </b>' + formatText(full, { hashtags: true }) +
      '\\n<button type="button" class="pv-toggle pv-toggle--inline is-expanded">접기</button>';
    var btn = box.querySelector('button');
    if (btn) btn.onclick = renderCollapsed;
  }

  renderCollapsed();
})();

/* 3. 유튜브 본문 접기/펼치기 (실제 앱처럼 제목 한 줄로 접혀 시작) */
(function() {
  var box = document.getElementById('yt-text');
  if (!box) return;
  var full = DATA.ytText || '';
  if (!full) { box.innerHTML = '<span style="color:var(--pv-muted)">본문을 입력하면 여기에 표시돼요</span>'; return; }

  var lines = full.split('\\n');
  var titleLine = lines[0];
  var isMulti = lines.length > 1;

  function renderCollapsed() {
    box.innerHTML = formatText(titleLine, { links: true, hashtags: true }) +
      (isMulti ? '<button type="button" class="pv-toggle pv-toggle--block">자세히 보기</button>' : '');
    var btn = box.querySelector('button');
    if (btn) btn.onclick = renderExpanded;
  }

  function renderExpanded() {
    box.innerHTML = formatText(full, { links: true, hashtags: true }) +
      '<button type="button" class="pv-toggle pv-toggle--block">간략히</button>';
    var btn = box.querySelector('button');
    if (btn) btn.onclick = renderCollapsed;
  }

  renderCollapsed();
})();

/* 4. 다크/라이트 테마 전환 (루시드 Sun/Moon 아이콘) */
(function() {
  var root = document.documentElement;
  var btn = document.getElementById('theme-btn');
  var iconEl = document.getElementById('theme-btn-icon');
  var textEl = document.getElementById('theme-btn-text');

  var sunSvg = ${JSON.stringify(LUCIDE_SUN_SVG)};
  var moonSvg = ${JSON.stringify(LUCIDE_MOON_SVG)};

  function updateThemeUI() {
    var isDark = root.dataset.theme ? root.dataset.theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (iconEl) iconEl.innerHTML = isDark ? sunSvg : moonSvg;
    if (textEl) textEl.textContent = isDark ? '라이트 모드' : '다크 모드';
    if (btn) btn.setAttribute('title', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
  }

  try {
    var saved = localStorage.getItem('preview-theme');
    if (saved) root.dataset.theme = saved;
  } catch (e) {}

  updateThemeUI();

  if (btn) {
    btn.onclick = function() {
      var isDark = root.dataset.theme ? root.dataset.theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      var next = isDark ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('preview-theme', next); } catch (e) {}
      updateThemeUI();
    };
  }
})();
</script>
</body>
</html>`;
}

/**
 * 단일 HTML 파일로 즉시 다운로드 실행 (비동기)
 */
export async function exportToSingleHtml(data) {
  const htmlContent = await generateSingleHtml(data);
  const fileName = getExportFileName();

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return fileName;
}
