// ─── Help Modal ───────────────────────────────────────────────────────────────
function HelpModal({ onClose }) {
  /*{onClose}는 부모 컴포넌트에서 넘겨주는 함수이다. 프롭스란 부모->자식 컴포넌트로 데이터나 함수를 전달하는 방법
  onclose{닫는 함수}와 stats={통계데이터} 부모 데이터를 자식으로 전달하는 것*/
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

export default HelpModal;
