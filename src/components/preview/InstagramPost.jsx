import useCarousel from '../../hooks/useCarousel';
import { PLATFORM_RULES } from '../../constants/platformRules';
import Avatar from './Avatar';
import Carousel from './Carousel';
import CollapsibleText from './CollapsibleText';
import { IconBookmark, IconComment, IconHeart, IconMoreHorizontal, IconSend } from '../common/Icons';

const RULES = PLATFORM_RULES.ig;

/** 인스타그램 피드 카드 */
export default function InstagramPost({ profile, post }) {
  const carousel = useCarousel(post.images.length);
  const name = profile.name || '계정 이름';

  return (
    <article className="pv-post pv-ig">
      <header className="pv-head">
        <Avatar name={name} image={profile.avatar} ring />
        <div className="pv-name">{name}</div>
        <span className="pv-more">
          <IconMoreHorizontal />
        </span>
      </header>

      <Carousel
        images={post.images}
        carousel={carousel}
        aspect={RULES.defaultAspect}
        emptyLabel="인스타그램 이미지·동영상을 추가해주세요"
      />

      <div className="pv-ig-actions">
        <div className="pv-ig-actions__left">
          <IconHeart />
          <IconComment />
          <IconSend />
        </div>
        <div className="pv-dots">
          {carousel.count > 1 &&
            post.images.map((img, i) => <i key={img.id} className={i === carousel.index ? 'on' : ''} />)}
        </div>
        <div className="pv-ig-actions__right">
          <IconBookmark />
        </div>
      </div>

      <div className="pv-ig-likes">좋아요 0개</div>

      {post.text ? (
        <CollapsibleText
          className="pv-ig-caption"
          text={post.text}
          previewLines={RULES.previewLines}
          prefix={<b>{name} </b>}
          highlight={{ hashtags: true }}
          variant="inline"
          moreLabel="더 보기"
          lessLabel="접기"
        />
      ) : (
        <p className="pv-ig-caption pv-placeholder">캡션을 입력하면 여기에 표시돼요</p>
      )}

      <div className="pv-ig-time">방금 전</div>
    </article>
  );
}
