/**
 * 프로필 동그라미
 * - 이미지가 없으면 이름 앞 2글자 표시
 * - 이미지가 있으면 배경색을 비우고 크롭된 이미지 렌더링
 * - ring: 인스타그램 스토리 테두리(그라데이션)
 */
export default function Avatar({ name, image, ring = false, size = 36 }) {
  const initials = (name || '?').trim().slice(0, 2);

  return (
    <div className={`pv-avatar${ring ? ' pv-avatar--ring' : ''}`} style={{ width: size, height: size }}>
      <div className={`pv-avatar__inner${image ? ' pv-avatar__inner--has-img' : ''}`}>
        {image ? <img src={image} alt="" /> : <span>{initials}</span>}
      </div>
    </div>
  );
}
