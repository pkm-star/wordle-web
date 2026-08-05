import useGameStore from '../useGameStore';
import { BANNER_URL } from '../constants';

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="26" fill="currentColor">
    <rect x="3" y="6"  width="18" height="2" rx="1" />
    <rect x="3" y="11" width="18" height="2" rx="1" />
    <rect x="3" y="16" width="18" height="2" rx="1" />
  </svg>
);
const IconStats = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="34" viewBox="0 0 212 170" width="34" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="square" strokeLinejoin="miter">
    <line x1="42" y1="155" x2="199" y2="155"/>
    <polyline points="42,155 42,71 91,71 91,155"/>
    <polyline points="96,155 96,21 145,21 145,155"/>
    <polyline points="150,155 150,91 199,91 199,155"/>
  </svg>
);
//뷰박스는 0 x축, 0 y축, 212 가로길이(width), 170 세로길이(height)
const IconHelp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="33" viewBox="0 0 24 24" width="33" fill="currentColor">
    <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
  </svg>
);
const IconHints = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="35" viewBox="-13 0 188 168" width="35">
    <path fill="currentColor" d="M107.184647,127.763161 C106.509651,136.182297 103.184525,140.254211 95.757332,140.641861 C87.792610,141.057571 79.762779,140.936523 71.798798,140.444214 C64.687714,140.004608 60.916794,135.384552 60.818249,128.210159 C60.795361,126.543892 60.688816,124.865883 60.835400,123.212296 C61.733864,113.077057 59.481697,105.655441 50.726513,97.991859 C25.066641,75.531288 30.046780,35.293884 59.980797,18.689690 C91.901443,0.983528 130.059235,22.227531 133.116119,57.102917 C134.748230,75.723076 128.026489,90.946274 112.748871,101.973343 C108.691803,104.901665 106.836151,108.326790 107.127029,113.300171 C107.399025,117.950714 107.185143,122.629662 107.184647,127.763161z"/>
    <path fill="var(--color-bg, #121212)" d="M116.701874,43.391712 C125.993195,60.091953 122.185303,79.692558 107.459198,91.468262 C102.521004,95.417091 97.229202,98.966431 95.956490,105.719376 C87.923027,105.719376 80.280373,105.719376 74.396263,105.719376 C69.106407,100.316780 65.019699,95.452431 60.246784,91.395370 C44.741325,78.215469 41.447891,55.454231 53.135166,40.024685 C65.915070,23.152639 88.035530,19.030420 105.128448,30.921650 C109.585915,34.022625 112.761620,38.966042 116.701874,43.391712z"/>
  </svg>
);
const IconSettings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="34" viewBox="0 0 24 24" width="34" fill="currentColor">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
  </svg>
);

// ─── Header ───────────────────────────────────────────────────────────────────
function Header() {
  const setShowHelp     = useGameStore(s => s.setShowHelp);
  const setShowStats    = useGameStore(s => s.setShowStats);
  const setShowSettings = useGameStore(s => s.setShowSettings);
  const hardMode = useGameStore(s => s.hardMode);

  return (
    <header className="header">
      {/* 왼쪽: 햄버거 */}
      <div className="header-left">
        <button className="header-btn" aria-label="Menu"><IconMenu /></button>
      </div>

      {/* 가운데: 제목 (데스크탑만 표시) */}
      <div className="header-center">
        <span className="header-title">Wordle</span>
        {hardMode && <span className="header-hard-badge">*</span>}
      </div>

      {/* 오른쪽: 전구·통계·도움말(데스크탑), 설정, Subscribe 버튼 */}
      <div className="header-right">
        <button className="header-btn desktop-only" aria-label="Hints"><IconHints /></button>
        <button className="header-btn desktop-only" onClick={() => setShowStats(true)} aria-label="Statistics"><IconStats /></button>
        <button className="header-btn desktop-only" onClick={() => setShowHelp(true)} aria-label="Help"><IconHelp /></button>
        <button className="header-btn" onClick={() => setShowSettings(true)} aria-label="Settings"><IconSettings /></button>
        <a className="subscribe-btn desktop-only" href={BANNER_URL} target="_blank" rel="noreferrer">Subscribe to Games</a>
      </div>
    </header>
  );
}
/* 배너 아래 부분 헤더에 있는 아이콘들을 누르면 모달이 열리게 하고 아이콘들을 넣어준다. onclick 실행하면 바로 true로
렌더링함*/

export default Header;
