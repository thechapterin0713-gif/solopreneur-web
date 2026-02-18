export interface PhaseInfo {
  number: number;
  name: string;
  description: string;
  outputFile: string | null;
  substeps: Array<{ key: string; label: string }>;
}

export const PHASES: PhaseInfo[] = [
  {
    number: 0,
    name: "온보딩",
    description: "현재 상황 파악",
    outputFile: null,
    substeps: [
      { key: "business_type_set", label: "비즈니스 유형 파악" },
      { key: "path_selected", label: "진행 경로 선택" },
      { key: "materials_checked", label: "기존 자료 확인" },
    ],
  },
  {
    number: 1,
    name: "시장 & 타겟 정의",
    description: "누구를 위한 비즈니스인가",
    outputFile: "01_타겟_시장.md",
    substeps: [
      { key: "target_who", label: "꿈의 고객 정의" },
      { key: "target_pain", label: "핵심 고통 파악" },
      { key: "target_desire", label: "욕구/결과 정의" },
      { key: "target_where", label: "고객 모임 장소" },
      { key: "market_validated", label: "시장 검증" },
    ],
  },
  {
    number: 2,
    name: "오퍼 설계",
    description: "무엇을 팔 것인가",
    outputFile: "02_오퍼_설계.md",
    substeps: [
      { key: "dream_outcome_defined", label: "꿈의 결과 정의" },
      { key: "obstacles_listed", label: "장애물 나열" },
      { key: "solutions_mapped", label: "해결책 설계" },
      { key: "delivery_decided", label: "전달 방법 결정" },
      { key: "pricing_set", label: "가격 책정" },
      { key: "enhancements_added", label: "보장/보너스 추가" },
      { key: "offer_named", label: "오퍼 네이밍" },
    ],
  },
  {
    number: 3,
    name: "포지셔닝 & 메시지",
    description: "어떻게 다르게 말할 것인가",
    outputFile: "03_포지셔닝.md",
    substeps: [
      { key: "existing_alternatives_identified", label: "기존 대안 파악" },
      { key: "new_opportunity_defined", label: "새로운 기회 정의" },
      { key: "big_domino_written", label: "빅 도미노 작성" },
      { key: "false_belief_vehicle", label: "수단 거짓 믿음" },
      { key: "false_belief_internal", label: "내적 거짓 믿음" },
      { key: "false_belief_external", label: "외적 거짓 믿음" },
    ],
  },
  {
    number: 4,
    name: "스토리 설계",
    description: "왜 나인가를 설득하는 이야기",
    outputFile: "04_스토리.md",
    substeps: [
      { key: "origin_backstory", label: "오리진 배경" },
      { key: "origin_wall", label: "장벽/실패" },
      { key: "origin_epiphany", label: "깨달음의 순간" },
      { key: "origin_transformation", label: "변화/결과" },
      { key: "villain_defined", label: "빌런 정의" },
      { key: "false_belief_stories", label: "거짓 믿음 스토리" },
      { key: "future_pacing", label: "퓨처 페이싱" },
    ],
  },
  {
    number: 5,
    name: "리드 & 트래픽",
    description: "어떻게 고객을 찾을 것인가",
    outputFile: "05_리드_트래픽.md",
    substeps: [
      { key: "resources_confirmed", label: "자원 확인" },
      { key: "dream_100_listed", label: "드림 100 리스트" },
      { key: "dig_strategy_selected", label: "파고들기 전략" },
      { key: "core_four_selected", label: "코어 포 선택" },
      { key: "content_plan_created", label: "콘텐츠 플랜" },
      { key: "lead_magnet_designed", label: "리드 마그넷 설계" },
    ],
  },
  {
    number: 6,
    name: "가치 사다리 & 퍼널",
    description: "어떻게 구조화된 판매를 할 것인가",
    outputFile: "06_가치사다리_퍼널.md",
    substeps: [
      { key: "free_tier_defined", label: "무료 티어 정의" },
      { key: "paid_tiers_defined", label: "유료 티어 설계" },
      { key: "conversion_path_defined", label: "전환 경로 설계" },
      { key: "email_sequence_written", label: "이메일 시퀀스" },
    ],
  },
  {
    number: 7,
    name: "실행 계획 & 런칭",
    description: "언제, 어떻게 시작할 것인가",
    outputFile: "07_실행계획.md",
    substeps: [
      { key: "goal_set", label: "30일 목표 설정" },
      { key: "goal_reverse_engineered", label: "목표 역산" },
      { key: "launch_plan_defined", label: "런칭 플랜" },
      { key: "hooks_created", label: "후크 리스트" },
      { key: "action_plan_created", label: "실행 계획표" },
      { key: "daily_checklist_created", label: "데일리 체크리스트" },
      { key: "kpi_defined", label: "KPI 정의" },
    ],
  },
];

export const DEFAULT_OUTPUTS: Record<string, boolean> = {
  "01_타겟_시장.md": false,
  "02_오퍼_설계.md": false,
  "03_포지셔닝.md": false,
  "04_스토리.md": false,
  "05_리드_트래픽.md": false,
  "06_가치사다리_퍼널.md": false,
  "07_실행계획.md": false,
  "최종_요약.md": false,
};

export function getPhaseInfo(phaseNumber: number): PhaseInfo | undefined {
  return PHASES.find((p) => p.number === phaseNumber);
}
