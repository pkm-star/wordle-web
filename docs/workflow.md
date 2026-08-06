2026.08.05
step1. UI는 react js로 만듦

step2. 클로드가 DB 전 리뷰 수정을 먼저하는 것을 권하였다. 현재 한 파일에 모든 내용이 담겨있었기에 이를 분리하여 진행하는 것이 코드를 두 번 건들이지 않고, 정리후 firebase를 진행하면 코드를 깔끔하게 끼워넣기가 편하다.
1. 컴포넌트 별 파일 분리 2.상수들 timing 상수로 묶기 3. 순수 함수들 분리하기, 4. 병합하기

step3. 링크트리에서 DB를 react와 잘 어울리는 supabase를 사용하였고 여기서는 firebase를 사용할 예정
firebase는 문서형(NOSQL)이라 DB데이터를 JSON같은 문서 한 덩어리로 관리 구글에서 관리
api로 연결하여 진행 npm 패키지를 설치함. Google이 만든 공식 Firebase JavaScript는 SDK로, firestore(DB명칭)랑 인증 기능을 코드에서 쓰기 위해 필요하다.
1. 통계(승률, 연승기록), 오늘 게임 상태, 설정(하드모드 등) 부라우저에서만 저장되던 것이 DB에도 저장

step4. vercel로 배포, github에 push만 하면 자동배포, 빠르고 간편함
