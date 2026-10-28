import { FileText, RotateCcw, Download, Sun, Moon, SquareArrowOutUpRight } from 'lucide-react';
import Button from '../common/Button';

/**
 * 상단 헤더: 서비스 로고 + [샘플 불러오기] + [전체 초기화] + [HTML 내보내기] + [테마 전환]
 */
export default function Header({
  theme,
  onToggleTheme,
  onLoadSample,
  onReset,
  onExportHtml,
}) {
  const isDark = theme === 'dark';

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="brand">
          <div className="brand__mark">
            <SquareArrowOutUpRight size={20} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="brand__title">SNS 콘텐츠 프리뷰</h1>
            <p className="brand__sub">인스타그램 피드 · 유튜브 커뮤니티 발행 전 미리보기</p>
          </div>
        </div>

        <div className="app-header__actions">
          <Button onClick={onLoadSample} title="기본 샘플 문구와 이미지를 채웁니다">
            <FileText size={15} />
            <span>샘플 불러오기</span>
          </Button>

          <Button onClick={onReset} title="입력된 모든 내용을 초기화합니다">
            <RotateCcw size={15} />
            <span>초기화</span>
          </Button>

          <Button
            variant="primary"
            onClick={onExportHtml}
            title="현재 미리보기를 SNS콘텐츠프리뷰_YYMMDD.html 단일 파일로 다운로드합니다"
          >
            <Download size={15} />
            <span>HTML 내보내기</span>
          </Button>

          <Button
            id="theme-toggle"
            icon
            onClick={onToggleTheme}
            aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            title={isDark ? '라이트 모드' : '다크 모드'}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </Button>
        </div>
      </div>
    </header>
  );
}
