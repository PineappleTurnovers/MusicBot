const Discord = require('discord.js');


module.exports = {
  name: 'volume',
  description: 'This command sets volume in vc.',
  commandtitle : 'Volume',
  aliases: ['volume'],
  usage: 'volume {volume number}',
  perms: 'Administrator',
  cooldown: 3,
  async execute(client, message, args, serverstatic){
  serverasigment = await serverstatic.findOne({ where: { guildid: message.guild.id } });
  if (message.member.hasPermission("ADMINISTRATOR") || client.config.devs.includes(message.author.id)){
  const { channel } = message.member.voice;
  if (!channel)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setColor('#96E2DE')
        .setDescription(`I'm sorry but you need to be in a voice channel to do this command!`)
    );
  const serverQueue = message.client.queue.get(message.guild.id);
  const serverTrivia = message.client.trivia.get(message.guild.id);
  if (!serverQueue && !serverTrivia)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setColor('#96E2DE')
        .setDescription(`There is nothing playing.`)
    );
  if (!args[0]){
  if (serverQueue){
    return message.channel.send(new Discord.MessageEmbed()
    .setColor('#96E2DE')
    .setDescription(`The current volume is: **${serverQueue.volume}**`)
    );
  }
  else if(serverTrivia){
    return message.channel.send(new Discord.MessageEmbed()
    .setColor('#96E2DE')
    .setDescription(`The current volume is: **${serverTrivia.volume}**`)
    );
  }
}
    if (isNaN(parseInt(args[0]))) return message.channel.send(new Discord.MessageEmbed()
    .setColor('#96E2DE')
    .setDescription(`Could not parse argument to intiger.`))
    
      
    if (serverQueue){
      serverQueue.volume = args[0]; 
      if(args[0] > 10) args[0] = 10;
      serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
      return message.channel.send(new Discord.MessageEmbed()
      .setColor('#96E2DE')
      .setDescription(`I set the volume to: **${args[0]}**`));
    }
  
  else if (serverTrivia){ 
    serverTrivia.volume = args[0]; 
    if(args[0] > 10) args[0] = 10;
    serverTrivia.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
    return message.channel.send(new Discord.MessageEmbed()
    .setColor('#96E2DE')
    .setDescription(`I set the volume to: **${args[0]}**`));
  }
  }
    else{
      message.channel.send(new Discord.MessageEmbed()
.setColor('#96E2DE')
.setDescription(`Insufficient role permissions`));
    }
}}
