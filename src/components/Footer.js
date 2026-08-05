import { FOOTER_LINKS } from '../constants';

// ─── Footer ───────────────────────────────────────────────────────────────────
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
/*링크들을 아래 배정하고 눌렀을 때 새창이 열리게 함, © 사이트 저작권 기호 */

export default Footer;
