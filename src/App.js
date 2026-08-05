import { useEffect, useCallback, useState } from 'react';
import useGameStore from './useGameStore';
import './App.css';
/*useState: 값을 기억하고, 바뀐 화면을 다시 보여줌(장바구니,계산), useEffect: 특정 상황(컴포넌트 등장,값 변경)
에 코드를 실행하는 도구, */
// ─── Help Modal ───────────────────────────────────────────────────────────────
function HelpModal({ onClose }) {
  /*{onClose}는 부모 컴포넌트에서 넘겨주는 함수이다. 프롭스란 부모->자식 컴포넌트로 데이터나 함수를 전달하는 방법
  onclose{닫는 하수}와 stats={통계데이터} 부모 데이터를 자식으로 전달하는 것*/
  const ExampleTile = ({ letter, status }) => (
    <div className={`tile example-tile ${status || ''} ${letter ? 'filled' : ''}`}>{letter}</div>
  );
/*ExampleTile은 팝업 안에서만 쓰이는 예시 
타일 e.stopPropagation은 내부 모달을 클릭하면 이벤트가 위로 안올라가 닫히지 않음. 계속 보여줌 */
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal help-modal" onClick={e => e.stopPropagation()}>
        {/*자바스크립트에 내장된 메소드로 클릭 이벤트는 클릭한 요소에서 시작해 부모로 계속 올라간다.
        즉 창이 뜨고 창 안을 클릭해서 html 기본 동작이 클릭을 하면 자동으로 부모로 올라간다는 말이 이전 단계로
        돌아간다는 말과 같아 기본화면으로 돌아간다. 그렇게 하지 않기 위해서 모달이 유지되기 위해서 stopPropagation()
        이라는 매서드를 사용해서 막아준다.  jsx 자바스크립트안에 html처럼 생긴 코드를 쓰는 곳에는 주석에 {}을 해줘야함
        */}
        <button className="modal-close help-modal-close" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
{/*xmlns는 XML 네임스페이스의 줄임말로 이 코드가 SVG 문법을 따른다고 알려주는 것. xml은 데이터를 태그로 구조화해서
표현하는 언어이다. xml은 형식이고, 그 위에 목적에 따라 이름을 붙인 것이다. <태그>내용<태그> */}
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
  /*상태를 만든다. time이 값, setTime 바뀌는 함수*/
  useEffect(() => {
    /*useEffect(함수,[의존성배열]), 빈 배열은 컴포넌트가 처음 화면에 나타날 때 딱 한 번만 실행  */
    function tick() {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      //0시 0분 0초 0밀리초
      const diff = tomorrow - now;
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    }
    /*padStart(2,'0') 숫자가 두자리 미만이면 앞에 0으로 채움 */
    tick();
    const id = setInterval(tick, 1000);
    /*setIntercal(실행함수, 간격ms), tick 함수를 1초마다 실행 */
    return () => clearInterval(id)//취소;
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
/*승률 계산. Math.rpund는 반올림(승리/실행수) 0이면 0 useGanmestore에서 초기값과 게임 끝날 때 마다 증강을 설정했음
*/
  const maxDist = Math.max(...Object.values(stats.guessDistribution), 1);
  const lastGuessCount = gameStatus === 'won' ? guesses.length : null;
/*guessDistribution은 몇번의 시도에 정답을 맞췄는지를 의미하며 이의 값을 가져온다. max로 큰 값을 가져오고 모든 값이
0이어도 최소 1을 보장한다. 나누셈에서 0을 방지. lastGuessCount는 정답을 마췄을 때 몇 번째에 맞췄는지 보여줌 */
  const handleShare = async () => {
    const text = getShareText();
    try {
      await navigator.clipboard.writeText(text);
      useGameStore.setState({ toastMessage: 'Copied to clipboard' });
    } catch {
      useGameStore.setState({ toastMessage: text });
    }
  };
/*async()는 비동기처리를 위한 문법으로 동기는 순차적 비동기는 응답성. 자바스크립트는 기본이 비동기이며 앞에 코드가
실행되기 전에 뒤에 코드를 실행하면 오류가 나기 때문에 반드시 실 행되어야 하는 코드에 await를 쓰고 이 코드가 있다는 것을
async로 할려주는 것.
navigator.clipboard는 브라우저 내장 객체로 navigator는 브라우저 정보와 기능을 담고 있는 객체이며 클립보드가 가능하고
텍스트를 클립보드에 쓰는 것이다.*/
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
{/* 통계를 누를 때 창(모달)에 보여지는 화면 구성*/}
          <h3 className="distribution-title">GUESS DISTRIBUTION</h3>
          <div className="distribution">
            {[1, 2, 3, 4, 5, 6].map(n => {
              const count = stats.guessDistribution[n] || 0;
              const pct = Math.max(Math.round((count / maxDist) * 100), 7);
              {/*count 횟수에 맞춘 수, pct 가장 많이 맞춘 횟수(막대 최대값)) 최소 7%를 보장한다.
                너무 작으면 화면에 보이지 않기 때문*/}
              return (
                <div key={n} className="dist-row">
                  {/*숫자와 컨테이너박스(그래프)) */}
                  <div className="dist-label">{n}</div>
                  <div
                    className={`dist-bar ${lastGuessCount === n ? 'highlight' : ''}`}
                    style={{ width: `${pct}%` }}
                  >
                    {/*막대 길이를 퍼센트로 결정, 이번 게임에 초록색 변경 */}
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
/*조건 && <컴포넌트> 일 때 조건이 참이면 화면에 표시, 게임이 끝났을 때 다음 게임 시간과, 공유 버튼을 보여줌 */
// ─── Settings Modal(설정창) ───────────────────────────────────────────────────────────
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
      }, 1500);//한 번 보여줌
      return () => clearTimeout(t);// 취소,그만
    }
  }, [message, clearToast]);//의존성 배열로 message가 바뀔 때마다 useEffect가 실행딥니다.
  if (!message) return null;

  return (
    <div className="toast-container">
      <div className={`toast ${visible ? 'toast-show' : 'toast-hide'}`}>{message}</div>
    </div>
  );
}
/*모든 토스트가 보여지고 사라지는 것을 관리, setVisible로 토스트를 보여주고, 1.5초 후 숨김작동 0.2초 더 기다렸다
자연스럽게 사라짐, CSS에 0.2초 동안 투명해져 자연스럽게 사라지게 설정.*/
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
/*뒤집는 동작, 몇초? 뒤집어지지 않았다면 뒤집고, 시간은 타일당 0.3초+0.25초 */
  const showColor = !isRevealing || revealed;
  const colorClass = showColor ? status : '';
// 뒤집는 중이 아니다. 색 보임, 공개됨(색보임),  showcolor가 아직 뒤집히지 않았을 떄 회색.
  let animClass = '';
  if (isRevealing) animClass = 'revealing';
  else if (isBouncing) animClass = 'bouncing';
// 정답일 때 약간 통통 튐
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
/*${colorClass || ''}는 위에서 선언된 변수로 correct, present, absent를 갖고 있다.
 */
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
//현재 입력 줄
  useEffect(() => {
    if (isRevealing) {
      const t = setTimeout(() => finishReveal(), 1700);
      return () => clearTimeout(t);
    }
  }, [isRevealing, finishReveal]);
/*뒤집는 중일 때 걸리는 시간 1.7초 다 뒤집고 finishReveal로 종료*/
  useEffect(() => {
    if (shakeRow) {
      const t = setTimeout(() => clearShake(), 600);
      return () => clearTimeout(t);
    }
  }, [shakeRow, clearShake]);
/*잘못 입력시 흔들리는 시간 0.6초 다 흔들면 종료 */
  const rows = [];
  for (let i = 0; i < 6; i++) {
    const tiles = [];
    const isLastGuess   = i === guesses.length - 1; // 마지막 제출한 줄
    const isFlipping    = isLastGuess && isRevealing;// 마지막 뒤집히는 줄
    const isBounceRow   = isLastGuess && bounceRow && gameStatus === 'won';//튀는 줄
    const isCurrentRow  = i === currentRow && gameStatus === 'playing';//지금 입력 중인 줄

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
/* tile에 지금까지 했던 활동들을 저장하여 새로고침을 하였을 때 데이터가 날아가지 않게 한다. 새로*고침하면 타일을 계속
새로 만들고 guesses를 통해 단어를 받아 채우는 것. localStorage로 컴퓨터에만 저장된다. */
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
/*타일 뒤집기가 끝난 후 기보드 색을 업데이트 한다.  */
  const handleClick = useCallback(key => {
    if (key === 'Enter') submitGuess();
    else if (key === '⌫') removeLetter();
    else addLetter(key);
  }, [addLetter, removeLetter, submitGuess]);
/*useCallback은 함수를 캐싱(저장)한다. 매번 새 함수를 만들지 않고 같은 함수를 재사용. 불필요한 리렌더링 방지용
(함수, [의존성]) 의존성이 바뀌면 실행. */
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
            {/* 키 색상, 엔터와 백스페이스 크기 넓힘 클릭시 동작 */}
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
          {i === 1 && <div className="key-spacer" /> }
        </div>
      ))}
    </div>
  );
}
/* 두번 째 줄에 센터배치하여 대칭을 맞춤 */
const BANNER_URL = 'https://www.nytimes.com/subscription?campaignId=8WULY&source=owned_display&areas=banner&campaign=AllAccessSale';
// 베너 누르면 링크
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
// ─── Banner ───────────────────────────────────────────────────────────────────
const BANNER_ROWS = [
  ['P','L','A','I','D'],
  ['V','O','I','L','A'],
  ['F','A','I','T','H'],
  ['M','A','I','Z','E'],
];
const BANNER_CORRECT = new Set(['0-2','1-4','2-1','3-2']);
const BANNER_ABSENT  = new Set(['0-0','1-0','2-0','3-0']);
/*배너의 타일과 그 타일의 색을 지정. set 위치 지정([행-열]), 중복없는 값등 */
function BannerTiles({ dark }) {
  // 기본ㅂ색 검은색
  return (
    <div className="banner-tiles">
      {BANNER_ROWS.map((row, ri) => (
        //줄과 인덱스 row 각 줄, ri 각 줄의 인덱스
        <div key={ri} className="banner-tile-row">
          {row.map((l, ci) => {
            // l이 내용, ci 인덱스 번호
            const key = `${ri}-${ci}`; // 그 위치의 정보(색)
            const cls = BANNER_CORRECT.has(key) ? 'b-correct' : BANNER_ABSENT.has(key) ? 'b-absent' : '';
            //초록, 회색, 노랑 타일
            return <div key={ci} className={`banner-tile ${cls} ${dark ? 'dark' : ''}`}>{l}</div>;
            //섹 표시 타일 안의 배경색
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
/* 배너를 만들고 URL을 걸음. a는 링크태그로 클릭하면 이동할 주소를 넣고, href 이동할 주소 작성,
target=blank 새 탭을 열어서 진행 rel=noreferrer은 새 탭을 열 때 어디서 왔는지 정보를 안넘김, 
새탭이 원래 탭 조작 방지 타겟과 같이. strong은 텍스트를 굵게, br은 줄바꿈, span 줄바꿈이 없는
인라인 태그로 문장 중간에 특정 단어에 스타일을 적용할 때 사용  */
// ─── Footer ───────────────────────────────────────────────────────────────────
const FOOTER_LINKS = [
  { label: 'NYTimes.com',       href: 'https://www.nytimes.com/' },
  { label: 'Sitemap',           href: 'https://www.nytimes.com/sitemaps/' },
  { label: 'Privacy Policy',    href: 'https://thenewyorktimeshelpcenter.helpjuice.com/10940941449492-The-New-York-Times-Company-Privacy-Policy' },
  { label: 'Terms of Service',  href: 'https://thenewyorktimeshelpcenter.helpjuice.com/115002797688-Policies/115014893428-Terms-of-Service/' },
  { label: 'Cookie Policy',     href: 'https://thenewyorktimeshelpcenter.helpjuice.com/the-new-york-times-company-cookie-policy' },
  { label: 'Terms of Sale',     href: 'https://thenewyorktimeshelpcenter.helpjuice.com/115014893968-terms-of-sale' },
];
/*label:이름표시, href:URL(링크) */
function Footer() {
  const year = new Date().getFullYear();
  /*Date() js내장 날짜 객체 생성. getFullYear js내장 연도 반환 */
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
/*링크들을 아래 배정하고 눌렀을 때 새창이 열리게 함, © 사이트 ㄹ저작권 기호 */
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
