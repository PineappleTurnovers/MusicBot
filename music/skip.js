const Discord = require('discord.js');


module.exports = {
  name: 'skip',
  description: 'This command skips current music.',
  commandtitle : 'Skip',
  aliases: ['skip', 's', 'next'],
  usage: 'skip',
  perms: 'DJ role +', 
  cooldown: 3,
  async execute(client, message, args, serverstatic){
  serverasigment = await serverstatic.findOne({ where: { guildid: message.guild.id } });
  if (message.member.roles.cache.has(serverasigment.djroleid) || client.config.devs.includes(message.author.id)|| message.member.hasPermission("ADMINISTRATOR")){
  const { channel } = message.member.voice;
  const serverTrivia = message.client.trivia.get(message.guild.id);
  if (serverTrivia){
    return message.channel.send(new Discord.MessageEmbed().setColor(client.config.embedColors.music).setDescription(`I'm sorry but trivia is playing!`));
  }
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
    if (serverQueue.connection != null && serverQueue.connection.dispatcher != null)
      serverQueue.connection.dispatcher.end("Skip command has been used!");
    else
      message.channel.send(new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
        .setDescription(`You cannot skip when I am already skipping!`))
    }
    else{
      message.channel.send(new Discord.MessageEmbed()
      .setColor(client.config.embedColors.music)
.setDescription(`Insufficient role permissions`));
    }
    
}}
