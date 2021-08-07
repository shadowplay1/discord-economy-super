/**
* Cooldown manager methods object.
*/
declare class CooldownManager {

   /**
   * Clears user's daily cooldown
   * @param {String} memberID Member ID
   * @param {String} guildID Guild ID
   * @returns {Boolean} If cleared: true; else: false
   */
   public clearDaily(memberID: String, guildID: String): Boolean

   /**
   * Clears user's work cooldown
   * @param {String} memberID Member ID
   * @param {String} guildID Guild ID
   * @returns {Boolean} If cleared: true; else: false
   */
   public clearWork(memberID: String, guildID: String): Boolean

   /**
   * Clears user's weekly cooldown
   * @param {String} memberID Member ID
   * @param {String} guildID Guild ID
   * @returns {Boolean} If cleared: true; else: false
   */
   public clearWeekly(memberID: String, guildID: String): Boolean

   /**
   * Gets user's daily cooldown
   * @param {String} memberID Member ID
   * @param {String} guildID Guild ID
   * @returns Cooldown end timestamp
   */
   public daily(memberID: string, guildID: string): Number

   /**
   * Gets user's work cooldown
   * @param {String} memberID Member ID
   * @param {String} guildID Guild ID
   * @returns Cooldown end timestamp
   */
   public work(memberID: string, guildID: string): Number

   /**
   * Gets user's weekly cooldown
   * @param {String} memberID Member ID
   * @param {String} guildID Guild ID
   * @returns Cooldown end timestamp
   */
   public weekly(memberID: string, guildID: string): Number
}

export = CooldownManager