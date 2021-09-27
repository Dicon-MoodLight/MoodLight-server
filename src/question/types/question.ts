export const moodList = ['sad', 'angry', 'happy'] as const;

export type Mood = typeof moodList[number];
