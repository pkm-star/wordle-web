import { useEffect } from 'react';
import useGameStore from './useGameStore';
import Banner from './components/Banner';
import Header from './components/Header';
import Toast from './components/Toast';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import Footer from './components/Footer';
import HelpModal from './components/modals/HelpModal';
import StatsModal from './components/modals/StatsModal';
import SettingsModal from './components/modals/SettingsModal';
import './App.css';

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const addLetter     = useGameStore(s => s.addLetter);
  const removeLetter  = useGameStore(s => s.removeLetter);
  const submitGuess   = useGameStore(s => s.submitGuess);
  const toastMessage  = useGameStore(s => s.toastMessage);
  const showHelp      = useGameStore(s => s.showHelp);
  const showStats     = useGameStore(s => s.showStats);
  const showSettings  = useGameStore(s => s.showSettings);
  const setShowHelp   = useGameStore(s => s.setShowHelp);
  const setShowStats  = useGameStore(s => s.setShowStats);
  const setShowSettings = useGameStore(s => s.setShowSettings);

  // Keyboard input
  useEffect(() => {
    const onKeyDown = e => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (showHelp || showStats || showSettings) return;
      if (e.key === 'Enter') submitGuess();
      else if (e.key === 'Backspace') removeLetter();
      else if (/^[a-zA-Z]$/.test(e.key)) addLetter(e.key);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [addLetter, removeLetter, submitGuess, showHelp, showStats, showSettings]);
  /* ctrl,Cmd, alt 키를 무시한다. 키보드 입력시 처리하고 /^[a-zA-Z]$/.test(e.key)입력된 키가 알파벳인지
  확인하여 글자를 입력. 값들이 바뀔 때 마다 동작 */

  return (
    <>
      <Banner />
      <div className="app">
        <Header />
        <main className="game">
          <div className="board-container">
            <Toast message={toastMessage} />
            <Board />
          </div>
          <Keyboard />
        </main>
        <Footer />
      </div>
      {/* NYT 구독 배너, 상단 헤더, 팝업 메시지, 6*5 타일, 화면 하단 키보드, 하단 링크 */}

      {showHelp     && <HelpModal     onClose={() => setShowHelp(false)} />}
      {showStats    && <StatsModal    onClose={() => setShowStats(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}

export default App;
