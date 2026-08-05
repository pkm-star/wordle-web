// 타이밍 상수 - 모든 애니메이션 타이밍을 한 곳에서 관리
export const TIMING = {
  TILE_FLIP_STEP: 300,   // 타일 하나당 뒤집기 간격 (ms)
  TILE_FLIP_OFFSET: 250, // 뒤집기 시작 전 대기 시간
  BOUNCE_STEP: 100,      // 정답 시 타일 튀기 간격
  BOARD_REVEAL: 1700,    // 전체 뒤집기 완료까지 걸리는 시간
  SHAKE_DURATION: 600,   // 잘못 입력 시 흔들리는 시간
  BOUNCE_DURATION: 1500, // 타일 튀기 유지 시간
  TOAST_DURATION: 1500,  // 토스트 표시 시간
  TOAST_FADE: 200,       // 토스트 사라지는 페이드 시간
  REVEAL_DONE: 1600,     // 뒤집기 후 토스트 표시까지 대기
  STATS_DELAY: 2000,     // 토스트 후 통계 모달 열리기까지 대기
};

// NYT 구독 배너 URL
export const BANNER_URL = 'https://www.nytimes.com/subscription?campaignId=8WULY&source=owned_display&areas=banner&campaign=AllAccessSale';

// 키보드 배열
export const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
];

// 배너 타일 데이터
export const BANNER_ROWS = [
  ['P', 'L', 'A', 'I', 'D'],
  ['V', 'O', 'I', 'L', 'A'],
  ['F', 'A', 'I', 'T', 'H'],
  ['M', 'A', 'I', 'Z', 'E'],
];
export const BANNER_CORRECT = new Set(['0-2', '1-4', '2-1', '3-2']);
export const BANNER_ABSENT  = new Set(['0-0', '1-0', '2-0', '3-0']);
/*배너의 타일과 그 타일의 색을 지정. set 위치 지정([행-열]), 중복없는 값들 */

// 푸터 링크 목록
export const FOOTER_LINKS = [
  { label: 'NYTimes.com',      href: 'https://www.nytimes.com/' },
  { label: 'Sitemap',          href: 'https://www.nytimes.com/sitemaps/' },
  { label: 'Privacy Policy',   href: 'https://thenewyorktimeshelpcenter.helpjuice.com/10940941449492-The-New-York-Times-Company-Privacy-Policy' },
  { label: 'Terms of Service', href: 'https://thenewyorktimeshelpcenter.helpjuice.com/115002797688-Policies/115014893428-Terms-of-Service/' },
  { label: 'Cookie Policy',    href: 'https://thenewyorktimeshelpcenter.helpjuice.com/the-new-york-times-company-cookie-policy' },
  { label: 'Terms of Sale',    href: 'https://thenewyorktimeshelpcenter.helpjuice.com/115014893968-terms-of-sale' },
];
/*label:이름표시, href:URL(링크) */
