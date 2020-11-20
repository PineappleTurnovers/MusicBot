const Discord = require('discord.js');


module.exports = {
  name: 'queue',
  description: 'This command shows queue for current guild.',
  commandtitle : 'Queue',
  aliases: ['queue', 'q'],
  usage: 'queue',
  perms: 'Mini DJ role +',
  cooldown: 3,
  async execute(client, message, args, serverstatic){
  serverasigment = await serverstatic.findOne({ where: { guildid: message.guild.id } });
  if (message.member.roles.cache.has(serverasigment.djroleid)||message.member.roles.cache.has(serverasigment.minidjroleid) || client.config.devs.includes(message.author.id)|| message.member.hasPermission("ADMINISTRATOR")){
    const serverTrivia = message.client.trivia.get(message.guild.id);
    if (serverTrivia){
      return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`I'm sorry but trivia is playing!`));
    }
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)
    return message.channel.send(
      new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
        .setDescription(`There is nothing playing.`)
    );
    var requester;
    if (serverQueue.songs[0].request.id == undefined){
      requester = serverQueue.songs[0].request;
    }
    else{
      requester = `<@${serverQueue.songs[0].request.id}>`
    }
  var queuemsg = (
    new Discord.MessageEmbed()
    .setColor(client.config.embedColors.music)
    .setTitle('**Song queue:**')
    .setDescription(`__Now Playing:__ \n 1. [${serverQueue.songs[0].title}](${serverQueue.songs[0].url}) | [${requester}] \n\n __Up Next:__`));
    if(serverQueue.songs[1] == null){
      queuemsg.setDescription(queuemsg.description + "\nNo songs left in queue!")
    }
    else{
      var queueLength;
      if (serverQueue.songs.length > 10) queueLength = 10;
      else queueLength = serverQueue.songs.length;
    for(var i = 1; i < queueLength; i++){
      var item = serverQueue.songs[i];
      queuemsg.setDescription(queuemsg.description + `\n${i+1}. [${item.title}](${item.url}) | [<@${item.request.id}>]\n`);
   }
  }
  queuemsg.setDescription(queuemsg.description + `\n `)
  queuemsg.setFooter(`Songs in queue: ${serverQueue.songs.length}`);
  return message.channel.send(queuemsg);
  }
  else{
    message.channel.send(new Discord.MessageEmbed()
    .setColor(client.config.embedColors.music)
.setDescription(`Insufficient role permissions`));
  }
}
}
