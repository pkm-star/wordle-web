import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Firebase 프로젝트 설정값
const firebaseConfig = {
  apiKey: "AIzaSyAObUMLlxdHfP0RpI8hfCQMEmG_vmryYNE",
  authDomain: "wordle-web-10a4f.firebaseapp.com",
  projectId: "wordle-web-10a4f",
  storageBucket: "wordle-web-10a4f.firebasestorage.app",
  messagingSenderId: "947601203553",
  appId: "1:947601203553:web:2dc9a7819c3985ac376520",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);  // Firestore DB 인스턴스
const auth = getAuth(app);            // 인증 인스턴스

// ─── 익명 인증 ────────────────────────────────────────────────────────────────
// 이미 로그인되어 있으면 그 uid를, 아니면 새로 익명 로그인해서 uid를 반환
// Promise를 반환하므로 await로 기다려야 함
export function initAuth() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user.uid);
        // onAuthStateChanged는 로그인 상태가 바뀔 때마다 실행되는 감지 함수
        // user가 있으면 이미 로그인된 상태이므로 바로 uid 반환
      } else {
        signInAnonymously(auth)
          .then((cred) => resolve(cred.user.uid))
          .catch(() => resolve(null));
        // 로그인 안 된 상태면 익명 로그인 시도
        // 실패해도 null 반환해서 앱이 멈추지 않음
      }
    });
  });
}

// ─── 통계 저장/불러오기 ───────────────────────────────────────────────────────
// Firestore 경로: users/{uid}/data/stats
export async function saveStatsToCloud(uid, stats) {
  try {
    await setDoc(doc(db, 'users', uid, 'data', 'stats'), stats);
    // setDoc: 문서를 생성하거나 덮어씀. doc()으로 경로를 지정하고 stats 객체를 저장
  } catch (e) {
    console.error('통계 저장 실패:', e);
  }
}

export async function loadStatsFromCloud(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid, 'data', 'stats'));
    return snap.exists() ? snap.data() : null;
    // snap.exists()로 문서가 있는지 확인, snap.data()로 내용 가져옴
  } catch {
    return null;
  }
}

// ─── 게임 상태 저장/불러오기 ─────────────────────────────────────────────────
// Firestore 경로: users/{uid}/gameStates/{dayIndex}
// 날짜별로 저장해서 오늘 게임만 불러옴
export async function saveGameStateToCloud(uid, dayIndex, state) {
  try {
    await setDoc(doc(db, 'users', uid, 'gameStates', String(dayIndex)), state);
    // dayIndex를 문자열로 변환 (Firestore 문서 ID는 문자열이어야 함)
  } catch (e) {
    console.error('게임 상태 저장 실패:', e);
  }
}

export async function loadGameStateFromCloud(uid, dayIndex) {
  try {
    const snap = await getDoc(doc(db, 'users', uid, 'gameStates', String(dayIndex)));
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
}
