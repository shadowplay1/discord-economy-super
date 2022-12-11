export enum RewardType {
    DAILY = 0,
    WORK = 1,
    WEEKLY = 2
}

export type Reward<T extends RewardType> = T