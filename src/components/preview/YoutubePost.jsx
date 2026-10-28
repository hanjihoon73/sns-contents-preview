import useCarousel from '../../hooks/useCarousel';
import { PLATFORM_RULES } from '../../constants/platformRules';
import Avatar from './Avatar';
import Carousel from './Carousel';
import CollapsibleText from './CollapsibleText';
import { IconMoreVertical, IconShare, IconThumbUp, IconYtComment } from '../common/Icons';

const RULES = PLATFORM_RULES.yt;

/** 유튜브 커뮤니티 게시물 카드 (본문은 실제 앱처럼 접힌 상태로 시작) */
export default function YoutubePost({ profile, post }) {
  const carousel = useCarousel(post.images.length);
  const name = profile.name || '채널 이름';

  return (
    <article className="pv-post pv-yt">
      <header className="pv-head">
        <Avatar name={name} image={profile.avatar} />
        <div className="pv-name">
          {name} <span className="pv-sub">· 방금 전</span>
        </div>
        <span className="pv-more">
          <IconMoreVertical />
        </span>
      </header>

      {post.text ? (
        <CollapsibleText
          className="pv-yt-text"
          text={post.text}
          previewLines={RULES.previewLines}
          highlight={{ hashtags: true, links: true }}
          variant="block"
          moreLabel="자세히 보기"
          lessLabel="간략히"
        />
      ) : (
        <p className="pv-yt-text pv-placeholder">본문을 입력하면 여기에 표시돼요</p>
      )}

      <Carousel
        images={post.images}
        carousel={carousel}
        aspect={RULES.defaultAspect}
        emptyLabel="유튜브 이미지를 추가해주세요"
      />

      <div className="pv-yt-bar">
        <span>
          <IconThumbUp /> 0
        </span>
        <span>
          <IconThumbUp down /> 0
        </span>
        <span>
          <IconYtComment /> 0
        </span>
        <span className="pv-yt-bar__share">
          <IconShare />
        </span>
      </div>
    </article>
  );
}
