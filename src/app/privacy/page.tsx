export const metadata = {
  title: "개인정보 처리방침 | 핀포인트",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-xl font-semibold">개인정보 처리방침</h1>
      <p className="mt-2 text-sm text-neutral-500">
        이 문서는 사내 도구 &ldquo;핀포인트&rdquo;가 이용자의 개인정보를 어떻게
        수집·이용·보관하는지 설명합니다. 사내 배포 전 회사 사정(보관 기간, 담당 연락처 등)에
        맞게 관리자가 검토·수정해서 사용해주세요.
      </p>

      <section className="mt-8">
        <h2 className="text-base font-semibold text-neutral-900">1. 수집하는 개인정보 항목</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-700">
          <li>아이디, 비밀번호 (bcrypt로 해시 처리하여 저장, 원문은 저장되지 않음)</li>
          <li>실명 — 회원가입 시 입력하며, 책임 소재 확인 목적으로 관리자만 열람 가능</li>
          <li>닉네임, 부서, 팀 — 다른 이용자에게 공개적으로 표시됨</li>
          <li>등록한 페인포인트/댓글/반응 내용과 작성 시각</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-base font-semibold text-neutral-900">2. 수집 및 이용 목적</h2>
        <p className="mt-2 text-sm text-neutral-700">
          사내 부서/팀별 페인포인트를 공유하고 함께 해결책을 논의하는 서비스를 제공하기 위해
          이용자를 식별하고, 작성한 콘텐츠의 작성자를 표시하기 위한 목적으로만 사용합니다.
          마케팅, 광고, 제3자 판매 목적으로는 사용하지 않습니다.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-base font-semibold text-neutral-900">3. 실명 비공개 원칙</h2>
        <p className="mt-2 text-sm text-neutral-700">
          다른 이용자에게는 실명이 아닌 닉네임만 노출됩니다. 실명은 계정 관리(비밀번호 재설정
          등) 및 책임 소재 확인이 필요한 경우에 한해 관리자만 확인할 수 있습니다.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-base font-semibold text-neutral-900">4. 제3자 제공 및 외부 전송</h2>
        <p className="mt-2 text-sm text-neutral-700">
          원칙적으로 개인정보를 외부에 제공하지 않습니다. 다만 관리자가 Slack 알림 기능을
          활성화한 경우, 새로 등록된 글의 제목·내용 일부와 작성자 닉네임이 지정된 Slack
          채널로 전송될 수 있습니다.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-base font-semibold text-neutral-900">5. 보유 및 이용 기간</h2>
        <p className="mt-2 text-sm text-neutral-700">
          계정 및 작성한 콘텐츠는 이용자가 재직 중이거나 별도로 삭제를 요청하기 전까지
          보관됩니다. 삭제를 원하시면 관리자에게 문의해주세요.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-base font-semibold text-neutral-900">6. 안전성 확보 조치</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-700">
          <li>비밀번호는 bcrypt 해시로 저장 (원문 저장 안 함)</li>
          <li>세션은 서명된 토큰을 httpOnly 쿠키로 발급 (자바스크립트로 탈취 불가)</li>
          <li>로그인 5회 연속 실패 시 일정 시간 계정 잠금 (무차별 대입 공격 방어)</li>
          <li>관리자 비밀번호 재설정은 암호학적으로 안전한 난수로 임시 비밀번호 생성</li>
          <li>기본 보안 헤더(CSP 등) 적용</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-base font-semibold text-neutral-900">7. 이용자의 권리</h2>
        <p className="mt-2 text-sm text-neutral-700">
          내 정보(닉네임/이름/부서/팀)는{" "}
          <a href="/me" className="underline">
            내 정보 수정
          </a>{" "}
          페이지에서 언제든 직접 열람·수정할 수 있습니다. 계정 삭제, 작성 글 삭제, 비밀번호
          재설정 등은 관리자에게 문의해주세요.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-base font-semibold text-neutral-900">8. 문의</h2>
        <p className="mt-2 text-sm text-neutral-700">
          개인정보 관련 문의는 사내 관리자에게 연락해주세요.
        </p>
      </section>
    </div>
  );
}
