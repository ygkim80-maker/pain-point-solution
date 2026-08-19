# 핀포인트

사내 각 부서/팀이 겪는 페인포인트를 등록하고, 댓글 스레드로 함께 해결책을 논의하며,
상태(제안됨 → 논의중 → 해결됨)를 추적하는 내부 협업 도구입니다.

- 회원가입/로그인 (아이디+비밀번호+실명+닉네임+부서/팀). 실명은 관리자만 볼 수 있고,
  다른 사람에게는 닉네임만 노출됩니다.
- 페인포인트 등록 (제목/내용/카테고리/부서/팀)
- 부서·상태 필터, 최신순/공감순/🔥트렌딩(최근 3일 반응이 많은 글) 정렬
- 반응 4종(🙌 공감 / 🙋 저도요 / 👀 확인 / 🎉 축하, 각각 독립적으로 토글), 댓글 스레드, 상태 변경 (관리자만)
- 내 정보 수정: 닉네임/이름/부서/팀을 본인이 직접 변경 (`/me`)
- 관리자 페이지: 비밀번호를 잊은 사용자에게 임시 비밀번호 발급
- 부서별 통계 대시보드 (등록 건수, 상태 분포, 해결률)
- 새 페인포인트/댓글/상태 변경 시 Slack 알림 (선택)

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
   - `ADMIN_USERNAMES`: 관리자 권한을 줄 아이디를 쉼표로 나열 (예: `kim_dev,park_admin`). 해당 아이디로 가입하거나 로그인하면 자동으로 관리자가 됩니다.
   - `SLACK_WEBHOOK_URL` (선택): 새 페인포인트/댓글/상태 변경을 알릴 Slack Incoming Webhook URL. 비워두면 알림 없이 조용히 동작합니다.
   - `NEXT_PUBLIC_APP_URL` (선택): Slack 알림에 넣을 앱 주소. 비워두면 Vercel 배포 URL을 자동으로 씁니다.
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
   - `ADMIN_USERNAMES` (선택, 위 설명 참고)
   - `SLACK_WEBHOOK_URL` (선택, 위 설명 참고)
4. **마이그레이션 적용**: 배포 전에 한 번 로컬에서 프로덕션 DB를 대상으로 마이그레이션을 적용합니다.
   ```bash
   DATABASE_URL="<neon-connection-string>" npx prisma migrate deploy
   ```
   (또는 Vercel Build Command를 `prisma migrate deploy && next build`로 바꿔 배포마다 자동 적용할 수도 있습니다.)
5. Vercel이 `npm install` 시 `postinstall` 스크립트로 Prisma Client를 자동 생성하고, `next build`로 빌드합니다.

## 데이터 모델

- `User`: 아이디/비밀번호(해시)/실명(관리자만 확인 가능)/닉네임(공개 표시용)/부서/팀/관리자 여부
- `PainPoint`: 제목/내용/카테고리/부서/팀/상태(OPEN·DISCUSSING·RESOLVED)
- `Comment`: 페인포인트에 달리는 댓글 (함께 고민하기 스레드)
- `Vote`: 사용자별 반응(공감/저도요, 반응 종류별로 1인 1표, 토글)

## 권한

- 일반 사용자: 페인포인트 등록, 공감, 댓글
- 관리자(`isAdmin`): 위 권한 + 상태 변경(제안됨/논의중/해결됨), 사용자 비밀번호 재설정 (`/admin/users`)
- 최초 관리자는 `ADMIN_USERNAMES` 환경변수로 지정합니다. 이후 관리자 페이지에서 별도 승격 기능은 아직 없어, 추가 관리자가 필요하면 해당 아이디를 `ADMIN_USERNAMES`에 추가하고 그 사용자가 다시 로그인하면 됩니다.
