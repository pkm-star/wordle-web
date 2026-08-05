import useGameStore from '../../useGameStore';

// ─── Settings Modal(설정창) ───────────────────────────────────────────────────
function SettingsModal({ onClose }) {
  const hardMode = useGameStore(s => s.hardMode);
  const colorBlind = useGameStore(s => s.colorBlind);
  const toggleHardMode = useGameStore(s => s.toggleHardMode);
  const toggleColorBlind = useGameStore(s => s.toggleColorBlind);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal settings-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>SETTINGS</h2>
          <button className="modal-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-title">Hard Mode</div>
              <div className="setting-desc">Any revealed hints must be used in subsequent guesses</div>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={hardMode} onChange={toggleHardMode} />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="setting-divider" />

          <div className="setting-row">
            <div className="setting-info">
              <div className="setting-title">Color Blind Mode</div>
              <div className="setting-desc">High contrast colors</div>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={colorBlind} onChange={toggleColorBlind} />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="setting-divider" />

          <div className="setting-row feedback-row">
            <a
              href="https://www.nytimes.com/wordle/"
              target="_blank"
              rel="noreferrer"
              className="feedback-link"
            >
              Play the official Wordle ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
/*하드모드, 색맹모드가 실행중인가. 실행중이면 toggleHard, Blind로 실행, 마지막에 워들 공식 홈페이지 링크를 걸어놓은 글*/

export default SettingsModal;
