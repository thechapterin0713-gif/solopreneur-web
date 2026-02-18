import type { SessionData } from "@/lib/types/session";

export function getPhase6Prompt(
  sessionData: SessionData,
  substeps: Record<string, boolean>,
  existingDocument: string | null
): string {
  return `## 현재 Phase: Phase 6 - 가치 사다리 & 퍼널

### 목적
가치 사다리, 훅-스토리-오퍼, 이메일 시퀀스를 사용하여 구조화된 판매 시스템을 설계합니다.

### 참조 프레임워크

#### 가치 사다리 (Russell Brunson)
[무료] → [저가 1-20만원] → [중가 30-100만원] → [고가 100-500만원] → [프리미엄 500만원+]
- 각 단계가 다음 단계에 대한 자연스러운 욕구를 만든다
- 위로 갈수록: 더 밀착, 더 맞춤화, 더 빠른 결과

#### 훅-스토리-오퍼
모든 마케팅 메시지의 기본 구조:
- 훅: 주목을 끈다 (제목, 첫 문장)
- 스토리: 공감과 신뢰 형성
- 오퍼: 행동 요청 (CTA)

#### 7일 이메일 시퀀스
Day 1: 환영 + 리드 마그넷 전달
Day 2: 오리진 스토리 (에피파니 브릿지)
Day 3-5: 가치 제공 + 사회적 증거
Day 6: 거짓 믿음 깨기
Day 7: 오퍼 제안

### 질문 리스트

#### 질문 1 — 무료 티어 확인
Phase 5의 리드 마그넷을 무료 티어로 확인하거나 수정
"리드 마그넷으로 [이전 설계한 것]을 사용할까요, 아니면 수정이 필요한가요?"

#### 질문 2 — 유료 티어 설계
"무료 다음 단계로 어떤 유료 상품을 만들 수 있을까요?"
- 최소 2개 티어 (저가 + 주력)
- 가격이 오름차순인지 검증

#### 질문 3 — 전환 경로
"각 단계에서 다음 단계로 고객을 어떻게 이동시킬 건가요?"
- 무료→저가: 이메일 시퀀스 + 소프트 피치
- 저가→중가: 가치 제공 후 자연스러운 업셀
- 중가→고가: 1:1 상담 제안

#### 질문 4 — 7일 이메일 시퀀스
"무료 자료를 받은 사람에게 보낼 7일 이메일을 함께 설계하겠습니다."
- 각 이메일의 제목, 핵심 내용, CTA 수집
- Phase 4의 스토리 활용
- 최소 Day 1, 2, 7은 필수

### 현재 수집된 데이터
${JSON.stringify({
  funnel: sessionData.funnel,
  offer: sessionData.offer,
  lead_strategy: { lead_magnet: sessionData.lead_strategy.lead_magnet },
  story: { origin: sessionData.story.origin },
}, null, 2)}

### 현재 서브스텝 상태
${JSON.stringify(substeps, null, 2)}

### 기존 산출물
${existingDocument || "없음"}

### 산출물 템플릿 (06_가치사다리_퍼널.md)
\`\`\`markdown
# 가치 사다리 & 퍼널

> 작성일: [날짜] | 상태: 초안 / 완료

## 1. 가치 사다리

| 단계 | 상품명 | 가격 | 형식 |
|------|--------|------|------|
| 무료 | | 0원 | |
| 저가 | | | |
| 중가 | | | |
| 고가 | | | |

## 2. 전환 경로

| From | To | 전환 방법 |
|------|----|-----------|

## 3. 7일 이메일 시퀀스

### Day 1: 환영
- 제목:
- 내용:
- CTA:

### Day 2: 오리진 스토리
(... Day 3-7 반복)

## 4. 퍼널 요약
- 퍼널 유형:
- 핵심 전환 포인트:
\`\`\`

### Phase 완료 조건
4개 서브스텝 모두 true이면 phase_complete: true, next_phase: 7`;
}
