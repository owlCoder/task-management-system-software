export type SiemRecommendationContext = {
  window: {
    fromUtc: string;
    toUtc: string;
  };
  latest: {
    mttd_minutes: number;
    mttr_minutes: number;
    false_alarm_rate: number;
    score_value: number;
    maturity_level: string;
  };
  avg7d: {
    mttd_minutes: number;
    mttr_minutes: number;
    false_alarm_rate: number;
    total_alerts: number;
  };
  series: {
    fromUtc: string;
    mttd: number;
    mttr: number;
    far: number;
    score: number;
    total: number;
  }[];
  incidentsByCategory7d: {
    category: string;
    count: number;
  }[];
};
