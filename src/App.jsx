import { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import MobileTabs from './components/layout/MobileTabs';
import EditorPanel from './components/editor/EditorPanel';
import PreviewPanel from './components/preview/PreviewPanel';
import ConfirmDialog from './components/common/ConfirmDialog';
import useTheme from './hooks/useTheme';
import useEditorState from './hooks/useEditorState';

/**
 * SNS 콘텐츠 프리뷰 메인 앱
 * Phase 2: 프로필/문구/이미지 업로드 및 드래그 정렬, 실시간 미리보기 연동
 */
export default function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    data,
    updateProfile,
    updateText,
    copyIgToYt,
    addImages,
    reorderImages,
    removeImage,
    resetAll,
    loadSampleData,
  } = useEditorState();

  const [mobileView, setMobileView] = useState('edit'); // 'edit' | 'preview'
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 최초 1회 샘플 데이터 로드 (빈 화면 대신 바로 볼 수 있도록)
  useEffect(() => {
    loadSampleData().finally(() => setIsInitialized(true));
  }, [loadSampleData]);

  const handleResetConfirm = () => {
    resetAll();
    setIsResetConfirmOpen(false);
  };

  if (!isInitialized) {
    return (
      <div className="app-loading">
        <p>미리보기 데이터를 준비하고 있어요…</p>
      </div>
    );
  }

  return (
    <>
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onLoadSample={loadSampleData}
        onReset={() => setIsResetConfirmOpen(true)}
      />

      <main className="app-main">
        {/* 모바일 화면용 뷰 전환 탭 (1024px 이하에서만 표시) */}
        <MobileTabs activeView={mobileView} onViewChange={setMobileView} />

        <div className="app-workspace">
          {/* 좌측: 편집 패널 */}
          <aside
            className={`app-workspace__editor ${
              mobileView !== 'edit' ? 'is-hidden-mobile' : ''
            }`}
          >
            <EditorPanel
              data={data}
              updateProfile={updateProfile}
              updateText={updateText}
              copyIgToYt={copyIgToYt}
              addImages={addImages}
              reorderImages={reorderImages}
              removeImage={removeImage}
            />
          </aside>

          {/* 우측: 실시간 미리보기 카드 */}
          <section
            className={`app-workspace__preview ${
              mobileView !== 'preview' ? 'is-hidden-mobile' : ''
            }`}
          >
            <PreviewPanel data={data} />
          </section>
        </div>
      </main>

      {/* 전체 초기화 확인 모달 */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="전체 초기화"
        message="작성 중인 모든 문구와 이미지가 지워집니다. 계속하시겠습니까?"
        onConfirm={handleResetConfirm}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </>
  );
}
