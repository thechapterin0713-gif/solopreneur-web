export interface SessionData {
  business_type: "신규" | "기존" | null;
  selected_path: "전체" | number | null;
  existing_materials: string | null;
  business_overview: {
    industry: string | null;
    target_summary: string | null;
    monthly_revenue: string | null;
  };
  target_profile: TargetProfile;
  offer: OfferData;
  positioning: PositioningData;
  story: StoryData;
  lead_strategy: LeadStrategyData;
  funnel: FunnelData;
  execution: ExecutionData;
  resources: ResourcesData;
}

export interface TargetProfile {
  who: string | null;
  demographics: {
    age: string | null;
    gender: string | null;
    occupation: string | null;
    income_level: string | null;
    location: string | null;
  };
  psychographics: {
    values: string | null;
    fears: string | null;
    aspirations: string | null;
  };
  pain: string[];
  desire: {
    before: string | null;
    after: string | null;
    transformation: string | null;
  };
  gathering_places: {
    online: string[];
    offline: string[];
  };
  market_validation: {
    pain_severity: boolean | null;
    purchasing_power: boolean | null;
    accessibility: boolean | null;
    growing_market: boolean | null;
    risk_notes: string | null;
  };
}

export interface OfferData {
  dream_outcome: string | null;
  obstacles: string[];
  solutions: Array<{
    obstacle: string;
    solution: string;
    delivery: string;
  }>;
  pricing: {
    price: number | null;
    launch_price: number | null;
    rationale: string | null;
  };
  guarantee: string | null;
  bonuses: string[];
  urgency: string | null;
  scarcity: string | null;
  name: string | null;
  one_liner: string | null;
}

export interface PositioningData {
  existing_alternatives: string[];
  new_opportunity: {
    type: string | null;
    definition: string | null;
    vs_existing: string | null;
  };
  big_domino: string | null;
  false_beliefs: {
    vehicle: { belief: string | null; truth: string | null; story_hint: string | null };
    internal: { belief: string | null; truth: string | null; story_hint: string | null };
    external: { belief: string | null; truth: string | null; story_hint: string | null };
  };
  core_message: string | null;
}

export interface StoryData {
  origin: {
    backstory: string | null;
    desire_external: string | null;
    desire_internal: string | null;
    wall: string | null;
    epiphany: string | null;
    transformation_before: string | null;
    transformation_after: string | null;
  };
  villain: {
    name: string | null;
    why_enemy: string | null;
    how_we_win: string | null;
  };
  false_belief_stories: {
    vehicle: { backstory: string | null; epiphany: string | null; transformation: string | null };
    internal: { backstory: string | null; epiphany: string | null; transformation: string | null };
    external: { backstory: string | null; epiphany: string | null; transformation: string | null };
  };
  future_pacing: string | null;
}

export interface LeadStrategyData {
  dream_100: {
    platforms: Array<{ name: string; url: string; members: number | null; access: string }>;
    youtube: Array<{ channel: string; subscribers: number | null; access: string }>;
    podcasts: Array<{ name: string; url: string }>;
    blogs: Array<{ name: string; url: string }>;
    influencers: Array<{ name: string; platform: string; followers: number | null }>;
    total_count: number;
  };
  dig_strategy: {
    free_methods: string[];
    paid_methods: string[];
    priority_order: string[];
  };
  core_four: {
    primary: string | null;
    secondary: string | null;
    daily_100_plan: string | null;
  };
  content_plan: {
    main_platform: string | null;
    weekly_calendar: Record<string, string[]>;
    e5_ideas: {
      educate: string[];
      entertain: string[];
      engage: string[];
      experience: string[];
      encourage: string[];
    };
  };
  lead_magnet: {
    type: string | null;
    title: string | null;
    description: string | null;
    format: string | null;
  };
}

export interface FunnelData {
  value_ladder: Array<{
    tier: string;
    name: string;
    price: number;
    format: string;
  }>;
  conversion_path: Array<{
    from: string;
    to: string;
    method: string;
  }>;
  email_sequence: Record<string, {
    subject: string;
    content_summary: string;
    cta: string;
  }>;
  funnel_type: string | null;
}

export interface ExecutionData {
  goal_30day: string | null;
  reverse_engineering: {
    final_goal: string | null;
    required_leads: string | null;
    required_traffic: string | null;
    daily_action: string | null;
  };
  launch: {
    has_event: boolean;
    event_name: string | null;
    event_date: string | null;
    email_sequence: Record<string, { subject: string; content: string; cta: string }>;
  };
  hooks: string[];
  weekly_plan: Record<string, {
    theme: string;
    actions: Array<{ day: string; task: string }>;
    goal: string;
  }>;
  daily_checklist: string[];
  kpi: Array<{
    metric: string;
    target: string | number;
    measurement: string;
  }>;
}

export interface ResourcesData {
  daily_hours: number | null;
  monthly_budget: number | null;
  warm_list_size: number | null;
  experience_level: string | null;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  current_phase: number;
  completed_phases: number[];
  current_phase_substeps: Record<string, boolean>;
  session_data: SessionData;
  outputs: Record<string, boolean | string>;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  project_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  phase: number | null;
  substep: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface OutputDocument {
  id: string;
  project_id: string;
  filename: string;
  content: string;
  phase: number;
  status: "draft" | "in_progress" | "completed";
  created_at: string;
  updated_at: string;
}

export function createEmptySessionData(): SessionData {
  return {
    business_type: null,
    selected_path: null,
    existing_materials: null,
    business_overview: { industry: null, target_summary: null, monthly_revenue: null },
    target_profile: {
      who: null,
      demographics: { age: null, gender: null, occupation: null, income_level: null, location: null },
      psychographics: { values: null, fears: null, aspirations: null },
      pain: [],
      desire: { before: null, after: null, transformation: null },
      gathering_places: { online: [], offline: [] },
      market_validation: { pain_severity: null, purchasing_power: null, accessibility: null, growing_market: null, risk_notes: null },
    },
    offer: {
      dream_outcome: null, obstacles: [], solutions: [],
      pricing: { price: null, launch_price: null, rationale: null },
      guarantee: null, bonuses: [], urgency: null, scarcity: null, name: null, one_liner: null,
    },
    positioning: {
      existing_alternatives: [],
      new_opportunity: { type: null, definition: null, vs_existing: null },
      big_domino: null,
      false_beliefs: {
        vehicle: { belief: null, truth: null, story_hint: null },
        internal: { belief: null, truth: null, story_hint: null },
        external: { belief: null, truth: null, story_hint: null },
      },
      core_message: null,
    },
    story: {
      origin: { backstory: null, desire_external: null, desire_internal: null, wall: null, epiphany: null, transformation_before: null, transformation_after: null },
      villain: { name: null, why_enemy: null, how_we_win: null },
      false_belief_stories: {
        vehicle: { backstory: null, epiphany: null, transformation: null },
        internal: { backstory: null, epiphany: null, transformation: null },
        external: { backstory: null, epiphany: null, transformation: null },
      },
      future_pacing: null,
    },
    lead_strategy: {
      dream_100: { platforms: [], youtube: [], podcasts: [], blogs: [], influencers: [], total_count: 0 },
      dig_strategy: { free_methods: [], paid_methods: [], priority_order: [] },
      core_four: { primary: null, secondary: null, daily_100_plan: null },
      content_plan: { main_platform: null, weekly_calendar: {}, e5_ideas: { educate: [], entertain: [], engage: [], experience: [], encourage: [] } },
      lead_magnet: { type: null, title: null, description: null, format: null },
    },
    funnel: {
      value_ladder: [], conversion_path: [], email_sequence: {}, funnel_type: null,
    },
    execution: {
      goal_30day: null,
      reverse_engineering: { final_goal: null, required_leads: null, required_traffic: null, daily_action: null },
      launch: { has_event: false, event_name: null, event_date: null, email_sequence: {} },
      hooks: [],
      weekly_plan: {},
      daily_checklist: [],
      kpi: [],
    },
    resources: { daily_hours: null, monthly_budget: null, warm_list_size: null, experience_level: null },
  };
}
