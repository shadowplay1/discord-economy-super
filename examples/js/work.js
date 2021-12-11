/* getting the module */
const economy = require('discord-economy-super');
const eco = new economy(
  workCoolDown: 60 * 60000, //work cooldown in ms, default: 1 hour.
  workAmount: [10, 50] //[min, max] that the work command will give the user, default: 10-50 coins
);

module.exports = {
 name:'addmoney',
  description:'Give someone an amount of money',
  usage:'[mentioned user] [amount],
  execute(message, args){
  //when the command is ran 
    
    //eco.rewards.work(userID, guildID)
    const work = eco.rewards.work(message.author.id, message.guild.id);
    
    if(!work.status)// if the user already worked, let them know
      return message.reply(`You have already worked! Time left until next work: **${work.value.days}** days, **${work.value.hours}** hours, **${work.value.minutes}** minutes and **${work.value.seconds}** seconds.`)

    else //if they just worked, let them know how many coins they earned !! 
      return message.reply(`You worked and earned ${work.pretty} coins!`
    
  }
}
