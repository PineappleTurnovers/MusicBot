const Discord = require('discord.js');


module.exports = {
  name: 'leave-cleanup',
  description: 'This command cleans songs that member added but he is not in vc.',
  commandtitle : 'Leave cleanup',
  aliases: ['leavecleanup'],
  usage: 'leavecleanup',
  perms: 'DJ role +',
  cooldown: 5,
  async execute(client, message, args, serverstatic){
  serverasigment = await serverstatic.findOne({ where: { guildid: message.guild.id } });
  if (message.member.roles.cache.has(serverasigment.djroleid) || client.config.devs.includes(message.author.id)|| message.member.hasPermission("ADMINISTRATOR")){
    const serverTrivia = message.client.trivia.get(message.guild.id);
      if (serverTrivia){
        return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`I'm sorry but trivia is playing!`));
      }
    const { channel } = message.member.voice;
    if (!channel)
    return message.channel.send(
      new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
        .setDescription(`I'm sorry but you need to be in a voice channel to do this command!`)
    );
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)
    return message.channel.send(
      new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
        .setDescription(`There is nothing playing.`)
    );
    var guildChannel = message.guild.channels.cache.get(serverasigment.voicechannel);
    var vcMembers = guildChannel.members;
    var membersVc = []
    for (let [snowflake, guildMember] of vcMembers) {   
      membersVc.push(snowflake.toString()); 
    }
    serverQueue.userRequests.forEach(element =>{
      if(membersVc.indexOf(element) === -1){
        for (var i = 1; i < serverQueue.songs.length; i++){
          if (serverQueue.songs[i].request.id === element){
            serverQueue.songs.splice(i, 1); 
            i--;
          }
        }
      }
    })
    message.client.queue.set(message.guild.id, serverQueue);
  }
  else{
    message.channel.send(new Discord.MessageEmbed()
    .setColor(client.config.embedColors.music)
.setDescription(`Insufficient role permissions`));
  }
}
}

