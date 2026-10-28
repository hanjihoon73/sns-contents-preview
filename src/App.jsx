import { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import MobileTabs from './components/layout/MobileTabs';
import EditorPanel from './components/editor/EditorPanel';
import PreviewPanel from './components/preview/PreviewPanel';
import ConfirmDialog from './components/common/ConfirmDialog';
import useTheme from './hooks/useTheme';
import useEditorState from './hooks/useEditorState';
import { exportToSingleHtml } from './utils/exportHtml';

/**
 * SNS 콘텐츠 프리뷰 메인 앱
 * Phase 3: IndexedDB 자동 저장 및 SNS콘텐츠프리뷰_YYMMDD.html 단일 파일 내보내기 연동
 */
export default function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    data,
    isInitialized,
    initData,
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
  const [toastMessage, setToastMessage] = useState('');

  // 최초 1회 저장된 데이터 복원 (IndexedDB -> 없으면 기본 샘플 로드)
  useEffect(() => {
    initData();
  }, [initData]);

  const handleResetConfirm = async () => {
    await resetAll();
    setIsResetConfirmOpen(false);
    showToast('모든 입력 내용이 초기화되었습니다.');
  };

  const handleExportHtml = async () => {
    try {
      showToast('HTML 파일을 생성하고 있어요…');
      const fileName = await exportToSingleHtml(data);
      showToast(`'${fileName}' 파일이 다운로드되었습니다!`);
    } catch (err) {
      alert('HTML 내보내기 중 오류가 발생했습니다: ' + err.message);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  if (!isInitialized) {
    return (
      <div className="app-loading">
        <p>이전 작업 데이터를 확인하고 있어요…</p>
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
        onExportHtml={handleExportHtml}
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

      {/* 다운로드 및 완료 토스트 알림 */}
      {toastMessage && (
        <div className="toast-notification" role="status">
          {toastMessage}
        </div>
      )}
    </>
  );
}
