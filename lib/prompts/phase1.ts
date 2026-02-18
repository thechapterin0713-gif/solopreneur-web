import type { SessionData } from "@/lib/types/session";

export function getPhase1Prompt(
  sessionData: SessionData,
  substeps: Record<string, boolean>,
  existingDocument: string | null
): string {
  return `## 현재 Phase: Phase 1 - 시장 & 타겟 정의

### 목적
시크릿 포뮬러와 배고픈 군중(Starving Crowd) 프레임워크를 사용하여 타겟 시장과 고객을 정의합니다.

### 참조 프레임워크

#### 시크릿 포뮬러 (Russell Brunson)
1. WHO: 꿈의 고객은 누구인가? (인구통계 + 심리통계)
2. WHERE: 그들이 이미 모여있는 곳은?
3. BAIT: 그들을 끌어올 미끼는? (Phase 2에서 다룸)
4. RESULT: 고객에게 전달할 궁극적 변화/결과

#### 배고픈 군중 4가지 조건
1. 고통/문제가 심각한가
2. 구매력이 있는가
3. 접근 가능한 채널이 있는가
4. 성장하는 시장인가

### 질문 리스트

#### 질문 1 — 꿈의 고객 프로파일 (WHO)
"가장 도움을 드리고 싶은 이상적인 고객은 어떤 분인가요? 나이, 직업, 현재 상황 등 떠오르는 대로 말씀해 주세요."
- 구체적 인물상 유도 (예: "35세, IT회사 재직 중, 퇴사 고민")
- 모호하면 페르소나 3가지 제시하고 선택하게

#### 질문 2 — 핵심 고통/문제 (PAIN)
"그 고객이 지금 가장 힘들어하는 것은 무엇인가요? 밤에 잠 못 들게 하는 고민이 있다면요?"
- 감정적 디테일 유도
- 최소 1개 이상 수집

#### 질문 3 — 욕구/결과 (DESIRE)
"그 고객이 6개월 후에 어떤 상태가 되었으면 좋겠나요? Before와 After를 생각해 보세요."
- Before(현재 상태)와 After(원하는 상태) 모두 수집
- 변화 핵심 한 문장 정리

#### 질문 4 — 모여있는 곳 (WHERE)
"이 고객들이 평소에 어디서 정보를 찾고, 어떤 커뮤니티에 참여하고 있을까요? 온라인/오프라인 모두 말씀해 주세요."
- 최소 3개 채널 수집 (온라인/오프라인)
- 3개 미만이면 "이 고객이 이 문제를 검색할 때 어디서 찾을까요?" 추가 질문

#### 질문 5 — 시장 검증 (VALIDATION)
배고픈 군중 4가지 조건으로 시장 적합성 점검:
- 각 조건에 대해 평가 (충족/주의/미충족)
- 미충족 항목이 있으면 경고하되 진행 가능
- "이 시장은 4가지 조건 중 N가지를 충족합니다" 형태로 정리

### 현재 수집된 데이터
${JSON.stringify({
  target_profile: sessionData.target_profile,
  business_type: sessionData.business_type,
  business_overview: sessionData.business_overview,
}, null, 2)}

### 현재 서브스텝 상태
${JSON.stringify(substeps, null, 2)}

이미 true인 서브스텝에 해당하는 질문은 건너뛰세요.

### 기존 산출물
${existingDocument || "없음 (새로 시작)"}

### 산출물 템플릿 (01_타겟_시장.md)
Phase 완료 시 아래 형식으로 document_update에 포함하세요:

\`\`\`markdown
# 타겟 시장 & 고객 정의

> 작성일: [날짜]
> 상태: 초안 / 완료

## 1. 꿈의 고객 프로파일

### 인구통계
- 나이:
- 성별:
- 직업:
- 소득 수준:
- 지역:

### 심리통계
- 가치관:
- 두려움:
- 열망:

### 핵심 고객 한 줄 정의
>

## 2. 핵심 고통 (Pain Points)
1.
2.
3.

## 3. 욕구와 변화 (Desire & Transformation)

| Before (현재 상태) | After (원하는 상태) |
|---------------------|---------------------|
| | |

### 핵심 변화 한 문장
>

## 4. 고객이 모이는 곳

### 온라인
-
### 오프라인
-

## 5. 시장 검증 (배고픈 군중 체크)

| 조건 | 평가 | 근거 |
|------|------|------|
| 고통/문제의 심각성 | | |
| 구매력 | | |
| 접근 가능성 | | |
| 시장 성장성 | | |
\`\`\`

### Phase 완료 조건
5개 서브스텝 모두 true이면 phase_complete: true, next_phase: 2`;
}
