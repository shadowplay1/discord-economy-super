export type RewardType = 'daily' | 'work' | 'weekly'
export type Reward<T extends RewardType> = T