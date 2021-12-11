/* getting the module */
const economy = require('discord-economy-super');
const eco = new economy(
      weeklyCooldown: 60000 * 60 * 24 * 7, //the cooldown for weekly command, default: 1week
      weeklyAmount: 1000 //how much the weekly command should give, default: 1000
);

module.exports = {
 name:'addmoney',
  description:'Give someone an amount of money',
  usage:'[mentioned user] [amount],
  execute(message, args){
  //when the command is ran 
    
    //eco.rewards.weekly(userID, guildID)
    const weekly = eco.rewards.weekly(message.author.id, message.guild.id);
    
    if(!weekly.status) //the user has already claimed their weekly
    return message.reply(`You have already claimed your weekly reward! Time left until next claim: **${weekly.value.days}** days, **${weekly.value.hours}** hours, **${weekly.value.minutes}** minutes and **${weekly.value.seconds}** seconds.`)
    
    else //they just claimed their weekly
    return message.reply(`You have received **${weekly.reward}** weekly coins!`)  
  }
}
