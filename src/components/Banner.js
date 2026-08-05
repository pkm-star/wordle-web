import { BANNER_URL, BANNER_ROWS, BANNER_CORRECT, BANNER_ABSENT } from '../constants';

// ─── Banner ───────────────────────────────────────────────────────────────────
function BannerTiles({ dark }) {
  // 기본색 검은색
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
            //색 표시 타일 안의 배경색
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

export default Banner;
