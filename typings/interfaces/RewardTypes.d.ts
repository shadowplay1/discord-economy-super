export enum RewardType {
    DAILY = 0,
    WORK = 1,
    WEEKLY = 2,
    MONTHLY = 3,
    HOURLY = 4
}

export type Reward<T extends RewardType> = T