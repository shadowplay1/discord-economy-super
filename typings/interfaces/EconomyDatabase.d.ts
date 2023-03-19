import RawEconomyUser from './RawEconomyUser'
import HistoryData from './HistoryData'
import ItemData from './ItemData'

interface EconomyDatabase {
    [guildID: string]: {
        [memberID: string]: RawEconomyUser
    }
}

export = EconomyDatabase
