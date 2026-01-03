export const topicKeys = ['system-shock', 'work-money'] as const;

export type TopicKey = (typeof topicKeys)[number];

export const topicLabels: Record<TopicKey, string> = {
  'system-shock': 'System Shock',
  'work-money': 'Work & Money'
};
