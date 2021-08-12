/**
* Cooldown manager methods object.
*/
declare class CooldownManager {

   /**
   * Clears user's daily cooldown
   * @param {string} memberID Member ID
   * @param {string} guildID Guild ID
   * @returns {boolean} If cleared: true; else: false
   */
   public clearDaily(memberID: string, guildID: string): boolean

   /**
   * Clears user's work cooldown
   * @param {string} memberID Member ID
   * @param {string} guildID Guild ID
   * @returns {boolean} If cleared: true; else: false
   */
   public clearWork(memberID: string, guildID: string): boolean

   /**
   * Clears user's weekly cooldown
   * @param {string} memberID Member ID
   * @param {string} guildID Guild ID
   * @returns {boolean} If cleared: true; else: false
   */
   public clearWeekly(memberID: string, guildID: string): boolean

   /**
   * Gets user's daily cooldown
   * @param {string} memberID Member ID
   * @param {string} guildID Guild ID
   * @returns Cooldown end timestamp
   */
   public daily(memberID: string, guildID: string): number

   /**
   * Gets user's work cooldown
   * @param {string} memberID Member ID
   * @param {string} guildID Guild ID
   * @returns Cooldown end timestamp
   */
   public work(memberID: string, guildID: string): number

   /**
   * Gets user's weekly cooldown
   * @param {string} memberID Member ID
   * @param {string} guildID Guild ID
   * @returns Cooldown end timestamp
   */
   public weekly(memberID: string, guildID: string): number
}

export = CooldownManager