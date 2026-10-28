import { Edit3, Eye } from 'lucide-react';

/**
 * 모바일 화면에서 편집 / 미리보기 탭 전환 바
 */
export default function MobileTabs({ activeView, onViewChange }) {
  return (
    <div className="mobile-tabs" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={activeView === 'edit'}
        className={`mobile-tabs__btn ${activeView === 'edit' ? 'is-active' : ''}`}
        onClick={() => onViewChange('edit')}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
      >
        <Edit3 size={15} />
        <span>내용 편집</span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeView === 'preview'}
        className={`mobile-tabs__btn ${activeView === 'preview' ? 'is-active' : ''}`}
        onClick={() => onViewChange('preview')}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
      >
        <Eye size={15} />
        <span>실시간 미리보기</span>
      </button>
    </div>
  );
}
