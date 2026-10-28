import { PLATFORM_RULES } from '../../constants/platformRules';
import { countChars, countHashtags } from '../../utils/validators';
import InstagramPost from './InstagramPost';
import YoutubePost from './YoutubePost';

const fmt = (n) => n.toLocaleString('ko-KR');

/** 인스타그램·유튜브 카드를 나란히 배치하고 글자수 정보를 표시 */
export default function PreviewPanel({ data }) {
  const { profile, ig, yt } = data;
  const igRules = PLATFORM_RULES.ig;
  const ytRules = PLATFORM_RULES.yt;

  return (
    <section aria-label="미리보기">
      <div className="pv-grid">
        <div className="pv-section">
          <h2 className="pv-label">
            <span className="pv-label__dot pv-label__dot--ig" />
            {igRules.label} · {igRules.feedName} ({ig.images.length}장)
          </h2>
          <InstagramPost profile={profile} post={ig} />
          <p className="pv-meta">
            캡션 {fmt(countChars(ig.text))} / {fmt(igRules.maxChars)}자 · 해시태그 {countHashtags(ig.text)} /{' '}
            {igRules.maxHashtags}개 · 미디어 {ig.images.length} / {igRules.maxImages}개
          </p>
        </div>

        <div className="pv-section">
          <h2 className="pv-label">
            <span className="pv-label__dot pv-label__dot--yt" />
            {ytRules.label} · {ytRules.feedName} ({yt.images.length}장)
          </h2>
          <YoutubePost profile={profile} post={yt} />
          <p className="pv-meta">
            본문 {fmt(countChars(yt.text))} / {fmt(ytRules.maxChars)}자 · 이미지 {yt.images.length} /{' '}
            {ytRules.maxImages}장
          </p>
        </div>
      </div>

      <p className="pv-footnote">※ 실제 앱 화면의 줄바꿈·'더 보기' 위치는 기기마다 조금 다를 수 있어요.</p>
    </section>
  );
}
