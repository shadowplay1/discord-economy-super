/* getting the module */
const economy = require('discord-economy-super');
const eco = new economy(
  dailyAmount: 100 //the amount that daily will give, default: 100 coins
  dailyCooldown: 60 * 24 * 60000 //how long between each daily in ms, default: 1d

);

module.exports = {
 name:'addmoney',
  description:'Give someone an amount of money',
  usage:'[mentioned user] [amount],
  execute(message, args){
  //when the command is ran 
    
    //eco.rewards.daily(userID, guildID)
    const daily = eco.rewards.daily(message.author.id, message.guild.id);
    
    if(!daily.status) //user already claimed daily
    return message.reply(`You have already claimed your daily reward! Time left until next claim: **${daily.value.days}** days, **${daily.value.hours}** hours, **${daily.value.minutes}** minutes and **${daily.value.seconds}** seconds.`)
    
    else //the user just now claimed their daily
      return message.reply(`You have earned your daily: ${daily.reward} coins!`); 
  }
}
