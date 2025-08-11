```
# 🎮 NextPlay
다음 게임을 기대하게 만드는, RAWG API 기반 게임 정보 플랫폼

---

## 📌 소개
**NextPlay**는 전 세계 게임 데이터베이스 RAWG API를 기반으로,
새로운 게임을 발견하고, 다가오는 출시작을 달력에서 확인하며,
위시리스트로 나만의 게임 플레이 계획을 세울 수 있는 웹 애플리케이션입니다.

> "다음 플레이를 준비하자" – NextPlay

---

## 🛠 기술 스택
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Data Fetching**: TanStack Query
- **API**: RAWG Video Games API
- **Package Manager**: pnpm
- **Lint & Format**: ESLint (Airbnb), Prettier

---

## 📂 폴더 구조
src/
  app/
    page.tsx           # 홈
    games/             # 게임 목록
    game/[slug]/       # 게임 상세
    search/            # 검색
    releases/          # 출시 예정작
    wishlist/          # 위시리스트
  components/        # UI 컴포넌트
  lib/               # API 클라이언트, 타입, 훅
  providers/         # 전역 Provider
  styles/            # 전역 스타일

---
```
