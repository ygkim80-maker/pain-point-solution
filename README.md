# 페인포인트 해결 채널

사내 각 부서/팀이 겪는 페인포인트를 등록하고, 댓글 스레드로 함께 해결책을 논의하며,
상태(제안됨 → 논의중 → 해결됨)를 추적하는 내부 협업 도구입니다.

- 회원가입/로그인 (아이디+비밀번호, 부서/팀 정보 포함)
- 페인포인트 등록 (제목/내용/카테고리/부서/팀)
- 부서·상태 필터, 최신순/공감순 정렬
- 공감(투표), 댓글 스레드, 상태 변경

## 기술 스택

- Next.js 16 (App Router, Server Actions)
- PostgreSQL + Prisma 7 (`@prisma/adapter-pg`)
- 자체 세션 인증 (bcrypt 해시 + JWT 쿠키, 외부 이메일 서비스 불필요)
- Tailwind CSS

## 로컬 개발 환경 설정

1. 의존성 설치
   ```bash
   npm install
   ```
2. `.env` 파일 생성 (`.env.example` 참고)
   ```bash
   cp .env.example .env
   ```
   - `DATABASE_URL`: PostgreSQL 연결 문자열
   - `AUTH_SECRET`: 세션 서명용 랜덤 문자열 (32자 이상 권장, `openssl rand -base64 32`로 생성 가능)
3. DB 마이그레이션 적용
   ```bash
   npx prisma migrate dev
   ```
4. 개발 서버 실행
   ```bash
   npm run dev
   ```
   [http://localhost:3000](http://localhost:3000) 에서 확인합니다.

## 배포 (Vercel + Neon 예시)

회사 서버 없이 배포할 수 있습니다.

1. **DB 준비**: [Neon](https://neon.tech) 또는 [Supabase](https://supabase.com)에서 무료 Postgres 프로젝트를 생성하고
   연결 문자열(`DATABASE_URL`)을 발급받습니다.
2. **Vercel 프로젝트 연결**: 이 레포를 Vercel에 Import 합니다.
3. **환경 변수 설정** (Vercel 프로젝트 Settings → Environment Variables):
   - `DATABASE_URL`
   - `AUTH_SECRET`
4. **마이그레이션 적용**: 배포 전에 한 번 로컬에서 프로덕션 DB를 대상으로 마이그레이션을 적용합니다.
   ```bash
   DATABASE_URL="<neon-connection-string>" npx prisma migrate deploy
   ```
   (또는 Vercel Build Command를 `prisma migrate deploy && next build`로 바꿔 배포마다 자동 적용할 수도 있습니다.)
5. Vercel이 `npm install` 시 `postinstall` 스크립트로 Prisma Client를 자동 생성하고, `next build`로 빌드합니다.

## 데이터 모델

- `User`: 아이디/비밀번호(해시)/이름/부서/팀
- `PainPoint`: 제목/내용/카테고리/부서/팀/상태(OPEN·DISCUSSING·RESOLVED)
- `Comment`: 페인포인트에 달리는 댓글 (함께 고민하기 스레드)
- `Vote`: 사용자별 공감(1인 1표, 토글)
