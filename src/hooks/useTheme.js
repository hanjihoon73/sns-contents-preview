import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'preview-theme';

/** 라이트/다크 모드 상태 관리 (선택값은 브라우저에 기억) */
export default function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* 저장 실패해도 화면 전환은 동작 */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  return { theme, toggleTheme };
}
