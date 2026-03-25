import { useEffect, useCallback, useState } from 'react';
import useGameStore from './useGameStore';
import './App.css';

// ─── Help Modal ───────────────────────────────────────────────────────────────
function HelpModal({ onClose }) {
  const ExampleTile = ({ letter, status }) => (
    <div className={`tile example-tile ${status || ''} ${letter ? 'filled' : ''}`}>{letter}</div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal help-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close help-modal-close" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        <div className="help-body">
          <h1 className="help-title">How To Play</h1>
          <p className="help-subtitle">Guess the Wordle in 6 tries.</p>
          <ul className="help-list">
            <li>Each guess must be a valid 5-letter word.</li>
            <li>The color of the tiles will change to show how close your guess was to the word.</li>
          </ul>

          <div className="help-divider" />
          <p className="examples-title"><strong>Examples</strong></p>

          <div className="example-row">
            <div className="example-tiles">
              {['W','O','R','D','Y'].map((l, i) => (
                <ExampleTile key={i} letter={l} status={i === 0 ? 'correct' : ''} />
              ))}
            </div>
            <p><strong>W</strong> is in the word and in the correct spot.</p>
          </div>

          <div className="example-row">
            <div className="example-tiles">
              {['L','I','G','H','T'].map((l, i) => (
                <ExampleTile key={i} letter={l} status={i === 1 ? 'present' : ''} />
              ))}
            </div>
            <p><strong>I</strong> is in the word but in the wrong spot.</p>
          </div>

          <div className="example-row">
            <div className="example-tiles">
              {['R','O','G','U','E'].map((l, i) => (
                <ExampleTile key={i} letter={l} status={i === 3 ? 'absent' : ''} />
              ))}
            </div>
            <p><strong>U</strong> is not in the word in any spot.</p>
          </div>

          <div className="help-divider" />
          <p className="help-footer">A new puzzle is released daily at midnight.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Countdown Hook ───────────────────────────────────────────────────────────
function useCountdown() {
  const [time, setTime] = useState('');
  useEffect(() => {
    function tick() {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow - now;
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ─── Stats Modal ──────────────────────────────────────────────────────────────
function StatsModal({ onClose }) {
  const stats = useGameStore(s => s.stats);
  const gameStatus = useGameStore(s => s.gameStatus);
  const guesses = useGameStore(s => s.guesses);
  const getShareText = useGameStore(s => s.getShareText);
  const countdown = useCountdown();

  const winPct = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  const maxDist = Math.max(...Object.values(stats.guessDistribution), 1);
  const lastGuessCount = gameStatus === 'won' ? guesses.length : null;

  const handleShare = async () => {
    const text = getShareText();
    try {
      await navigator.clipboard.writeText(text);
      useGameStore.setState({ toastMessage: 'Copied to clipboard' });
    } catch {
      useGameStore.setState({ toastMessage: text });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>STATISTICS</h2>
          <button className="modal-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="stats-row">
            {[
              [stats.gamesPlayed, 'Played'],
              [winPct, 'Win %'],
              [stats.currentStreak, 'Current\nStreak'],
              [stats.maxStreak, 'Max\nStreak'],
            ].map(([num, label]) => (
              <div key={label} className="stat-item">
                <div className="stat-number">{num}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>

          <h3 className="distribution-title">GUESS DISTRIBUTION</h3>
          <div className="distribution">
            {[1, 2, 3, 4, 5, 6].map(n => {
              const count = stats.guessDistribution[n] || 0;
              const pct = Math.max(Math.round((count / maxDist) * 100), 7);
              return (
                <div key={n} className="dist-row">
                  <div className="dist-label">{n}</div>
                  <div
                    className={`dist-bar ${lastGuessCount === n ? 'highlight' : ''}`}
                    style={{ width: `${pct}%` }}
                  >
                    {count}
                  </div>
                </div>
              );
            })}
          </div>

          {(gameStatus === 'won' || gameStatus === 'lost') && (
            <div className="stats-footer">
              <div className="next-wordle">
                <div className="next-wordle-label">NEXT WORDLE</div>
                <div className="next-wordle-timer">{countdown}</div>
              </div>
              <div className="stats-divider" />
              <button className="share-btn" onClick={handleShare}>
                SHARE &nbsp;
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Settings Modal ───────────────────────────────────────────────────────────
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

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message }) {
  const clearToast = useGameStore(s => s.clearToast);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(clearToast, 200);
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [message, clearToast]);

  if (!message) return null;

  return (
    <div className="toast-container">
      <div className={`toast ${visible ? 'toast-show' : 'toast-hide'}`}>{message}</div>
    </div>
  );
}

// ─── Tile ─────────────────────────────────────────────────────────────────────
function Tile({ letter, status, delay, isRevealing, isBouncing }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (isRevealing) {
      setRevealed(false);
      const t = setTimeout(() => setRevealed(true), delay * 300 + 250);
      return () => clearTimeout(t);
    }
  }, [isRevealing, delay]);

  const showColor = !isRevealing || revealed;
  const colorClass = showColor ? status : '';

  let animClass = '';
  if (isRevealing) animClass = 'revealing';
  else if (isBouncing) animClass = 'bouncing';

  return (
    <div
      className={`tile ${colorClass || ''} ${letter ? 'filled' : ''} ${animClass}`}
      style={{
        ...(isRevealing ? { animationDelay: `${delay * 300}ms` } : {}),
        ...(isBouncing   ? { animationDelay: `${delay * 100}ms` } : {}),
      }}
    >
      {letter}
    </div>
  );
}

// ─── Board ────────────────────────────────────────────────────────────────────
function Board() {
  const guesses      = useGameStore(s => s.guesses);
  const currentGuess = useGameStore(s => s.currentGuess);
  const gameStatus   = useGameStore(s => s.gameStatus);
  const isRevealing  = useGameStore(s => s.isRevealing);
  const bounceRow    = useGameStore(s => s.bounceRow);
  const evalGuess    = useGameStore(s => s.evaluateGuess);
  const finishReveal = useGameStore(s => s.finishReveal);
  const shakeRow     = useGameStore(s => s.shakeRow);
  const clearShake   = useGameStore(s => s.clearShake);

  const currentRow = guesses.length;

  useEffect(() => {
    if (isRevealing) {
      const t = setTimeout(() => finishReveal(), 1700);
      return () => clearTimeout(t);
    }
  }, [isRevealing, finishReveal]);

  useEffect(() => {
    if (shakeRow) {
      const t = setTimeout(() => clearShake(), 600);
      return () => clearTimeout(t);
    }
  }, [shakeRow, clearShake]);

  const rows = [];
  for (let i = 0; i < 6; i++) {
    const tiles = [];
    const isLastGuess   = i === guesses.length - 1;
    const isFlipping    = isLastGuess && isRevealing;
    const isBounceRow   = isLastGuess && bounceRow && gameStatus === 'won';
    const isCurrentRow  = i === currentRow && gameStatus === 'playing';

    if (i < guesses.length) {
      const guess = guesses[i];
      const evl   = evalGuess(guess);
      for (let j = 0; j < 5; j++) {
        tiles.push(
          <Tile
            key={j}
            letter={guess[j]}
            status={evl[j]}
            delay={j}
            isRevealing={isFlipping}
            isBouncing={isBounceRow}
          />
        );
      }
    } else if (isCurrentRow) {
      for (let j = 0; j < 5; j++) {
        tiles.push(<Tile key={j} letter={currentGuess[j] || ''} />);
      }
    } else {
      for (let j = 0; j < 5; j++) {
        tiles.push(<Tile key={j} letter="" />);
      }
    }

    rows.push(
      <div
        key={i}
        className={`row ${isCurrentRow && shakeRow ? 'shake' : ''}`}
      >
        {tiles}
      </div>
    );
  }

  return <div className="board">{rows}</div>;
}

// ─── Keyboard ─────────────────────────────────────────────────────────────────
const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
];

function Keyboard() {
  const addLetter        = useGameStore(s => s.addLetter);
  const removeLetter     = useGameStore(s => s.removeLetter);
  const submitGuess      = useGameStore(s => s.submitGuess);
  const guesses          = useGameStore(s => s.guesses);
  const isRevealing      = useGameStore(s => s.isRevealing);
  const getLetterStatuses = useGameStore(s => s.getLetterStatuses);

  const [keyStatuses, setKeyStatuses] = useState({});
  useEffect(() => {
    if (!isRevealing) setKeyStatuses(getLetterStatuses());
  }, [isRevealing, guesses.length, getLetterStatuses]);

  const handleClick = useCallback(key => {
    if (key === 'Enter') submitGuess();
    else if (key === '⌫') removeLetter();
    else addLetter(key);
  }, [addLetter, removeLetter, submitGuess]);

  return (
    <div className="keyboard">
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className="keyboard-row">
          {/* 2번째 줄 좌우에 0.5 spacer — 원본 Wordle과 동일한 중앙 정렬 */}
          {i === 1 && <div className="key-spacer" />}
          {row.map(key => (
            <button
              key={key}
              className={`key ${keyStatuses[key] || ''} ${key.length > 1 || key === '⌫' ? 'wide' : ''}`}
              onClick={() => handleClick(key)}
            >
              {key === '⌫'
                ? <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 24 24" width="27" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8.25,4.5 L21.75,4.5 Q22.75,4.5 22.75,5.5 L22.75,18.5 Q22.75,19.5 21.75,19.5 L8.25,19.5 L2.25,12 Z"/>
                    <line x1="11.25" y1="8.75" x2="17.75" y2="15.25"/>
                    <line x1="17.75" y1="8.75" x2="11.25" y2="15.25"/>
                  </svg>
                : key
              }
            </button>
          ))}
          {i === 1 && <div className="key-spacer" />}
        </div>
      ))}
    </div>
  );
}

const BANNER_URL = 'https://www.nytimes.com/subscription?campaignId=8WULY&source=owned_display&areas=banner&campaign=AllAccessSale';

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="32" fill="currentColor">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);
const IconStats = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="35" viewBox="0 0 212 170" width="35" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="square" strokeLinejoin="miter">
    <line x1="42" y1="155" x2="199" y2="155"/>
    <polyline points="42,155 42,71 91,71 91,155"/>
    <polyline points="96,155 96,21 145,21 145,155"/>
    <polyline points="150,155 150,91 199,91 199,155"/>
  </svg>
);
//뷰박스는 0 x축, 0 y축, 212 가로길이(width), 170 세로길이(height)
const IconHelp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="34" viewBox="0 0 24 24" width="34" fill="currentColor">
    <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
  </svg>
);
const IconHints = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="-13 0 188 168" width="36">
    <path fill="currentColor" d="M107.184647,127.763161 C106.509651,136.182297 103.184525,140.254211 95.757332,140.641861 C87.792610,141.057571 79.762779,140.936523 71.798798,140.444214 C64.687714,140.004608 60.916794,135.384552 60.818249,128.210159 C60.795361,126.543892 60.688816,124.865883 60.835400,123.212296 C61.733864,113.077057 59.481697,105.655441 50.726513,97.991859 C25.066641,75.531288 30.046780,35.293884 59.980797,18.689690 C91.901443,0.983528 130.059235,22.227531 133.116119,57.102917 C134.748230,75.723076 128.026489,90.946274 112.748871,101.973343 C108.691803,104.901665 106.836151,108.326790 107.127029,113.300171 C107.399025,117.950714 107.185143,122.629662 107.184647,127.763161z"/>
    <path fill="var(--color-bg, #121212)" d="M116.701874,43.391712 C125.993195,60.091953 122.185303,79.692558 107.459198,91.468262 C102.521004,95.417091 97.229202,98.966431 95.956490,105.719376 C87.923027,105.719376 80.280373,105.719376 74.396263,105.719376 C69.106407,100.316780 65.019699,95.452431 60.246784,91.395370 C44.741325,78.215469 41.447891,55.454231 53.135166,40.024685 C65.915070,23.152639 88.035530,19.030420 105.128448,30.921650 C109.585915,34.022625 112.761620,38.966042 116.701874,43.391712z"/>
  </svg>
);
const IconSettings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="35" viewBox="0 0 24 24" width="35" fill="currentColor">
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

// ─── Banner ───────────────────────────────────────────────────────────────────
const BANNER_ROWS = [
  ['P','L','A','I','D'],
  ['V','O','I','L','A'],
  ['F','A','I','T','H'],
  ['M','A','I','Z','E'],
];
const BANNER_CORRECT = new Set(['0-2','1-4','2-1','3-2']);
const BANNER_ABSENT  = new Set(['0-0','1-0','2-0','3-0']);

function BannerTiles({ dark }) {
  return (
    <div className="banner-tiles">
      {BANNER_ROWS.map((row, ri) => (
        <div key={ri} className="banner-tile-row">
          {row.map((l, ci) => {
            const key = `${ri}-${ci}`;
            const cls = BANNER_CORRECT.has(key) ? 'b-correct' : BANNER_ABSENT.has(key) ? 'b-absent' : '';
            return <div key={ci} className={`banner-tile ${cls} ${dark ? 'dark' : ''}`}>{l}</div>;
          })}
        </div>
      ))}
    </div>
  );
}

function Banner() {
  return (
    <a className="banner" href={BANNER_URL} target="_blank" rel="noreferrer">
      <div className="banner-inner">
        <div className="banner-left"><BannerTiles /></div>
        <div className="banner-center">
          <div className="banner-nyt">The New York Times</div>
          <div className="banner-headline">Games is included in a<br/>Times subscription.</div>
          <div className="banner-sub">Sale ends soon.</div>
          <div className="banner-price"><strong>$0.50/week</strong> for your first <span className="banner-blue">six months</span> year.</div>
          <div className="banner-btn">SUBSCRIBE NOW</div>
          <div className="banner-fine">$3/week thereafter. Cancel or pause anytime.</div>
        </div>
        <div className="banner-right"><BannerTiles dark /></div>
      </div>
    </a>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
const FOOTER_LINKS = [
  { label: 'NYTimes.com',       href: 'https://www.nytimes.com/' },
  { label: 'Sitemap',           href: 'https://www.nytimes.com/sitemaps/' },
  { label: 'Privacy Policy',    href: 'https://thenewyorktimeshelpcenter.helpjuice.com/10940941449492-The-New-York-Times-Company-Privacy-Policy' },
  { label: 'Terms of Service',  href: 'https://thenewyorktimeshelpcenter.helpjuice.com/115002797688-Policies/115014893428-Terms-of-Service/' },
  { label: 'Cookie Policy',     href: 'https://thenewyorktimeshelpcenter.helpjuice.com/the-new-york-times-company-cookie-policy' },
  { label: 'Terms of Sale',     href: 'https://thenewyorktimeshelpcenter.helpjuice.com/115014893968-terms-of-sale' },
];

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <span className="footer-copy">© {year} The New York Times Company</span>
      {FOOTER_LINKS.map(({ label, href }) => (
        <a key={label} className="footer-link" href={href} target="_blank" rel="noreferrer">
          {label}
        </a>
      ))}
    </footer>
  );
}

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

      {showHelp     && <HelpModal     onClose={() => setShowHelp(false)} />}
      {showStats    && <StatsModal    onClose={() => setShowStats(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}

export default App;
