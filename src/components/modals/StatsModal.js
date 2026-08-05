import useGameStore from '../../useGameStore';
import useCountdown from '../../hooks/useCountdown';

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
  /*승률 계산. Math.round는 반올림(승리/실행수) 0이면 0 useGameStore에서 초기값과 게임 끝날 때 마다 증가를 설정했음
  */

  const maxDist = Math.max(...Object.values(stats.guessDistribution), 1);
  const lastGuessCount = gameStatus === 'won' ? guesses.length : null;
  /*guessDistribution은 몇번의 시도에 정답을 맞췄는지를 의미하며 이의 값을 가져온다. max로 큰 값을 가져오고 모든 값이
  0이어도 최소 1을 보장한다. 나누셈에서 0을 방지. lastGuessCount는 정답을 맞췄을 때 몇 번째에 맞췄는지 보여줌 */

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
  실행되기 전에 뒤에 코드를 실행하면 오류가 나기 때문에 반드시 실행되어야 하는 코드에 await를 쓰고 이 코드가 있다는 것을
  async로 알려주는 것.
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
              // count 횟수에 맞춘 수, pct 가장 많이 맞춘 횟수(막대 최대값), 최소 7%를 보장한다.
              // 너무 작으면 화면에 보이지 않기 때문
              const pct = Math.max(Math.round((count / maxDist) * 100), 7);
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

export default StatsModal;
